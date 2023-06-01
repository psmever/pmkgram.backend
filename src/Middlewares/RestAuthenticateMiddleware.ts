import { Request, Response, NextFunction } from 'express'
import { AuthenticateErrorResponse } from '@Commons/ResponseProvider'
import { Logger } from '@Logger'
import { tokenInfo } from '@TokenManager'

export const RestAuthenticateMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const Authorization = req.header('Authorization')?.replace('Bearer ', '')
    if (!Authorization) {
        // 토큰 체크
        AuthenticateErrorResponse(res)
    } else {
        Logger.info(`try token Info : ${Authorization}`)
        const tokeninfo = await tokenInfo({ token: Authorization }) // 토큰 디코딩 정보
        if (!tokeninfo.status) {
            // 토큰 디코딩 상태 체크
            Logger.error(`tokeninfo.status false : ${Authorization}`)
            AuthenticateErrorResponse(res)
        } else {
            if (!tokeninfo.token) {
                Logger.error(`tokeninfo.token false : ${Authorization}`)
                AuthenticateErrorResponse(res)
            } else {
                if (tokeninfo.token.status === 'N') {
                    Logger.error(`tokeninfo.token.status N : ${Authorization}`)
                    AuthenticateErrorResponse(res)
                } else {
                    next()
                }
            }
        }
    }
}
