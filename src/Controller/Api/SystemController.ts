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
    }

    SuccessResponse(res, { code: { step1: resultCodeStep1 } })
}
