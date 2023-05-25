import { Request, Response, NextFunction } from 'express'
import { ClientErrorResponse } from '@Commons/ResponseProvider'
import Messages from '@Commons/Messages'
import _ from 'lodash'
import Codes from '@Commons/Codes'
import { Logger } from '@Logger'

export const RestDefaultMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')

    // 클라이언트 타입 유무 체크
    if (_.isEmpty(req.headers['client-type'])) {
        ClientErrorResponse(res, Messages.error.clientTypeNotFound)
        return
    }

    // 클라이언트 타입 체크
    const findCode = _.find(Codes, { id: `010` })
    if (findCode) {
        if (
            !_.includes(
                _.map(findCode.list, (fl) => `010${fl.id}`),
                req.headers['client-type'],
            )
        ) {
            ClientErrorResponse(res, Messages.error.clientTypeNotFound)
            return
        }
    }

    Logger.info(`${JSON.stringify(req.headers)}`, null, true)
    Logger.info(`${JSON.stringify(req.body)}`, null, true)
    next()
}
