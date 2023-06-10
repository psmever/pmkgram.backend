import { Request, Response } from 'express'
import { ClientErrorResponse, NoCotentResponse, SuccessResponse, ServerErrorResponse } from '@Commons/ResponseProvider'
import _ from 'lodash'
import Messages from '@Messages'
import { emailValidator } from '@Helper'
import { generateLoginToken, revokeLogtinToken, tokenRefresh } from '@TokenManager'
import { emailExits, userCreate, getUserForLogin } from '@Service/UserService'
import { emailAuthSave } from '@Service/EmailAuthService'
import Config from '@Config'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import MailSender from '@Commons/MailSender'

// 이메일 중복 체크
export const EmailExits = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.params

    const checkEmail = decodeURIComponent(email)

    if (_.isEmpty(checkEmail)) {
        return ClientErrorResponse(res, Messages.auth.register.emailEmpty)
    }

    if (!emailValidator(checkEmail)) {
        return ClientErrorResponse(res, Messages.auth.register.emailValidate)
    }

    // 이메일 중복 체크
    const emailCheck = await emailExits({ email: checkEmail })
    if (emailCheck > 0) {
        return SuccessResponse(res, { email: checkEmail, exits: true })
    } else {
        return SuccessResponse(res, { email: checkEmail, exits: false })
    }
}

// 회원 가입
export const Register = async (req: Request, res: Response): Promise<Response> => {
    const authCode = uuidv4()
    const { email, password } = req.body

    if (_.isEmpty(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailEmpty)
    }

    if (!emailValidator(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailValidate)
    }

    if (_.isEmpty(password)) {
        return ClientErrorResponse(res, Messages.auth.register.passwordEmpty)
    }

    // 이메일 중복 체크
    const emailCheck = await emailExits({ email: email })
    if (emailCheck > 0) {
        return ClientErrorResponse(res, Messages.auth.register.emailExits)
    } else {
        const task = await userCreate({
            type: `${req.headers['client-type']}`,
            level: `030010`,
            status: `020010`,
            email: email,
            password: `${bcrypt.hashSync(password, Number(Config.BCRYPT_SALT))}`,
            nickname: `${email.split('@')[0].toLowerCase().replace(' ', _)}_${Math.floor(Date.now() / 1000)}`,
        })

        await emailAuthSave({
            user_id: task.id,
            authCode: authCode,
        })

        if (Config.APP_ENV === 'production') {
            MailSender.SendEmailAuth({
                ToEmail: email,
                EmailAuthCode: authCode,
            })
        }

        const payload: { email: string; nickname: string; authcode?: string; authlink?: string } = {
            email: task.email,
            nickname: task.nickname,
            authcode: authCode,
            authlink: Config.PORT
                ? `${Config.HOSTNAME}:${Config.PORT}/web/auth/emailauth/${authCode}`
                : `${Config.HOSTNAME}/web/auth/emailauth/${authCode}`,
        }

        if (Config.APP_ENV === 'production') {
            delete payload.authcode
            delete payload.authlink
        }

        return SuccessResponse(res, payload)
    }
}

// 로그인
export const Login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body

    if (_.isEmpty(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailEmpty)
    }

    if (!emailValidator(email)) {
        return ClientErrorResponse(res, Messages.auth.register.emailValidate)
    }

    if (_.isEmpty(password)) {
        return ClientErrorResponse(res, Messages.auth.register.passwordEmpty)
    }

    const findUser = await getUserForLogin({ email: email })

    if (findUser) {
        if (findUser.emailauth && findUser.emailauth.status === 'Y') {
            const checkPassword = await bcrypt.compare(password, findUser.password)
            if (checkPassword) {
                const genToken = await generateLoginToken({ user_id: findUser.id, email: email })
                return SuccessResponse(res, { access_token: genToken.accessToken, refresh_token: genToken.refreshToken })
            } else {
                return ClientErrorResponse(res, Messages.auth.login.checkPassword)
            }
        } else {
            return ClientErrorResponse(res, Messages.auth.login.mustEmailAuth)
        }
    } else {
        return ClientErrorResponse(res, Messages.auth.login.userExits)
    }
}

// 로그아웃
export const Logout = async (req: Request, res: Response): Promise<Response> => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token) {
        await revokeLogtinToken({ token: token })
        return NoCotentResponse(res)
    } else {
        return ClientErrorResponse(res, Messages.auth.logout.tokenVerifyError)
    }
}

// 로큰 refresh
export const TokenRefresh = async (req: Request, res: Response): Promise<Response> => {
    const { refresh_token } = req.body
    const refreshTask = await tokenRefresh({ refreshToken: refresh_token })
    if (refreshTask.status) {
        return SuccessResponse(res, { access_token: refreshTask.accessToken, refresh_token: refreshTask.refreshToken })
    } else {
        return ServerErrorResponse(res)
    }
}

// 토큰 정보
export const TokenInfo = async (req: Request, res: Response): Promise<Response> => {
    const { email, status, level } = req.app.locals.user
    return SuccessResponse(res, {
        email: email,
        status: status,
        level: level,
    })
}
