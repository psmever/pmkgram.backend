import { Request, Response } from 'express'
import { NoCotentResponse, SuccessResponse, ClientErrorResponse } from '@Commons/ResponseProvider'
import { findAll } from '@Service/CodeService'

// 서버 체크
export const CheckStatus = async (req: Request, res: Response): Promise<void> => {
    NoCotentResponse(res)

    res.end()
}

// 에러
export const ErrorTest = async (req: Request, res: Response): Promise<void> => {
    ClientErrorResponse(res, '문제가 발생 했습니다.', Error('에러발생'))

    res.end()
}

// 기본 데이터
export const BaseData = async (req: Request, res: Response): Promise<void> => {
    let resultCodeStep1 = {}
    let resultCodeStep2 = {}

    const getCode = await findAll()

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

    SuccessResponse(res, { code: { step1: resultCodeStep1, step2: resultCodeStep2 } })

    res.end()
}
