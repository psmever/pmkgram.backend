import { Request, Response, NextFunction } from 'express'
import { AuthenticateErrorResponse } from '@Commons/ResponseProvider'
import { Logger } from '@Logger'
import { tokenInfo } from '@TokenManager'

export const RestAuthenticateMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const Authorization = req.header('Authorization')?.replace('Bearer ', '')
    const authorizedPath = req.path.match(/^\/(\d+)\/feed-list$/)
    if (!Authorization) {
        // 토큰 체크
        authorizedPath ? next() : AuthenticateErrorResponse(res)
    } else {
        Logger.info(`try token Info : ${Authorization}`)
        const tokeninfo = await tokenInfo({ token: Authorization }) // 토큰 디코딩 정보
        if (!tokeninfo.status) {
            // 토큰 디코딩 상태 체크
            if (!authorizedPath) {
                Logger.error(`tokeninfo.status false : ${Authorization}`)
                AuthenticateErrorResponse(res)
            } else {
                next()
            }
        } else {
            if (!tokeninfo.token) {
                if (!authorizedPath) {
                    Logger.error(`tokeninfo.token false : ${Authorization}`)
                    AuthenticateErrorResponse(res)
                }
            } else {
                if (tokeninfo.token.status === 'N') {
                    if (!authorizedPath) {
                        Logger.error(`tokeninfo.token.status N : ${Authorization}`)
                        AuthenticateErrorResponse(res)
                    } else {
                        req.app.locals.user = {
                            auth: false,
                            user_id: 0,
                            email: '',
                            status: '',
                            level: '',
                        }
                        next()
                    }
                } else {
                    req.app.locals.user = {
                        auth: true,
                        user_id: tokeninfo.token.user.user_id,
                        email: tokeninfo.token.user.email,
                        status: tokeninfo.token.user.status,
                        level: tokeninfo.token.user.level,
                    }
                    next()
                }
            }
        }
    }
}
