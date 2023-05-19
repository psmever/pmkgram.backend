import { Request, Response } from 'express'
import { NoCotentResponse, SuccessResponse } from '@Commons/ResponseProvider'
import { DataBaseSource } from '@Database/DataBaseSource'
import { Codes } from '@Entity/Codes'

// 서버 체크
export const CheckStatus = async (req: Request, res: Response): Promise<void> => {
    NoCotentResponse(res)
}

// 기본 데이터
export const BaseData = async (req: Request, res: Response): Promise<void> => {
    const dataSource = await DataBaseSource

    let resultCodeStep1 = {}
    let resultCodeStep2 = {}

    if (dataSource) {
        const getCode = await dataSource.getRepository(Codes).createQueryBuilder('codes').getMany()

        resultCodeStep1 = getCode.map((code) => {
            const { code_id, name, group_id, type } = code
            return {
                type: type,
                group: group_id,
                code: code_id,
                name: name,
            }
        })

        const group = getCode.filter((c) => c.type === `group`)
        const code = getCode.filter((c) => c.type === `code`)

        resultCodeStep2 = group.map((g) => {
            return {
                group: g.group_id,
                name: g.name,
                codes: code
                    .filter((cf) => cf.group_id === g.group_id)
                    .map((cfg) => {
                        return {
                            code_id: cfg.code_id,
                            name: cfg.name,
                        }
                    }),
            }
        })
    }

    SuccessResponse(res, { code: { step1: resultCodeStep1, step2: resultCodeStep2 } })
}
