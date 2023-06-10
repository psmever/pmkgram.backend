import { Request, Response } from 'express'
import { getData, authentication } from '@Service/EmailAuthService'
import { emailVerified } from '@Service/UserService'
import Messages from '@Messages'

// 이메일 인증 처리
export const EnailAuth = async (req: Request, res: Response): Promise<void> => {
    const { authCode } = req.params

    const selectData = await getData({ authCode: authCode })

    if (selectData) {
        const { id, user_id, status, user } = selectData

        if (status === 'Y') {
            res.render('emailAuth', { message: Messages.auth.emailAuth.alreadyCode })
        } else if (!user) {
            res.render('emailAuth', { message: Messages.auth.emailAuth.emptyUser })
        } else {
            const step1 = await authentication({ id: id })
            const step2 = await emailVerified({ id: user_id })

            const { type: userType } = user

            // 010010,iOS
            // 010020,android
            // 010030,web
            let subMessage = ``
            if (userType === '010010') {
                subMessage = Messages.auth.emailAuth.successSubApp
            } else if (userType === '010020') {
                subMessage = Messages.auth.emailAuth.successSubApp
            } else {
                subMessage = Messages.auth.emailAuth.successSubWeb
            }

            if (step1 && step2) {
                res.render('emailAuth', { message: Messages.success.default, subMessage: subMessage })
            } else {
                res.render('emailAuth', { message: Messages.error.serverError, subMessage: `` })
            }
        }
    } else {
        res.render('emailAuth', { message: Messages.auth.emailAuth.authCodeExits, subMessage: `` })
    }

    res.end()
}
