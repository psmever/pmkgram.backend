import { Request, Response, NextFunction } from 'express'
import { AuthenticateErrorResponse } from '@Commons/ResponseProvider'
import { Logger } from '@Logger'
import { tokenInfo } from '@TokenManager'

export const RestAuthenticateMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const Authorization = req.header('Authorization')?.replace('Bearer ', '')
    if (!Authorization) {
        AuthenticateErrorResponse(res)
    } else {
        Logger.info(Authorization)
        const tokeninfo = await tokenInfo({ token: Authorization })
        if (!tokeninfo.status) {
            AuthenticateErrorResponse(res)
        } else {
            if (!tokeninfo.token) {
                AuthenticateErrorResponse(res)
            } else {
                if (tokeninfo.token.status === 'N') {
                    AuthenticateErrorResponse(res)
                } else {
                    next()
                }
            }
        }
    }
}
