import { Request, Response, NextFunction } from 'express'
import { Logger } from '@Logger'
import { tokenInfo } from '@TokenManager'

export const FeedAuthenticateMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const Authorization = req.header('Authorization')?.replace('Bearer ', '')
    if (!Authorization) {
        // 토큰 체크
        next()
    } else {
        Logger.info(`try token Info : ${Authorization}`)
        const tokeninfo = await tokenInfo({ token: Authorization }) // 토큰 디코딩 정보
        if (!tokeninfo.status) {
            // 토큰 디코딩 상태 체크
            next()
        } else {
            if (!tokeninfo.token) {
                next()
            } else {
                if (tokeninfo.token.status === 'N') {
                    req.app.locals.user = {
                        auth: false,
                        user_id: 0,
                        email: '',
                        status: '',
                        level: '',
                    }
                    next()
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
