import { Request, Response } from 'express'
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider'
import _ from 'lodash'
import Messages from '@Messages'
import { emailValidator } from '@Helper'
import { emailExits, userCreate, getUserForLogin } from '@Service/UserService'
import { emailAuthSave } from '@Service/EmailAuthService'
import Config from '@Config'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import MailSender from '@Commons/MailSender'

// 이메일 중복 체크
export const EmailExits = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params

    const checkEmail = decodeURIComponent(email)

    if (_.isEmpty(checkEmail)) {
        ClientErrorResponse(res, Messages.auth.register.emailEmpty)
    }

    if (!emailValidator(checkEmail)) {
        ClientErrorResponse(res, Messages.auth.register.emailValidate)
    }

    // 이메일 중복 체크
    const emailCheck = await emailExits({ email: checkEmail })
    if (emailCheck > 0) {
        SuccessResponse(res, { email: checkEmail, exits: true })
    } else {
        SuccessResponse(res, { email: checkEmail, exits: false })
    }
}

// 회원 가입
export const Register = async (req: Request, res: Response): Promise<void> => {
    const authCode = uuidv4()
    const { email, password } = req.body

    if (_.isEmpty(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailEmpty)
    }

    if (!emailValidator(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailValidate)
    }

    if (_.isEmpty(password)) {
        ClientErrorResponse(res, Messages.auth.register.passwordEmpty)
    }

    // 이메일 중복 체크
    const emailCheck = await emailExits({ email: email })
    if (emailCheck > 0) {
        ClientErrorResponse(res, Messages.auth.register.emailExits)
    } else {
        const task = await userCreate({
            type: `${req.headers['client-type']}`,
            level: `030010`,
            status: `020010`,
            email: email,
            password: `${bcrypt.hashSync(password, Number(Config.BCRYPT_SALTROUNDS))}`,
            nickname: `${email.split('@')[0].toLowerCase().replace(' ', _)}_${Math.floor(Date.now() / 1000)}`,
        })

        await emailAuthSave({
            user_id: task.id,
            authCode: authCode,
        })

        MailSender.SendEmailAuth({
            ToEmail: 'psmever@gmail.com',
            EmailAuthCode: authCode,
        })

        const payload: { email: string; nickname: string; auchcode?: string } = {
            email: task.email,
            nickname: task.nickname,
            auchcode: authCode,
        }

        if (Config.APP_ENV === 'production') {
            delete payload.auchcode
        }

        SuccessResponse(res, payload)
    }
}

// 로그인
export const Login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    if (_.isEmpty(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailEmpty)
    }

    if (!emailValidator(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailValidate)
    }

    if (_.isEmpty(password)) {
        ClientErrorResponse(res, Messages.auth.register.passwordEmpty)
    }

    const findUser = await getUserForLogin({ email: email })

    if (findUser) {
        const checkPassword = await bcrypt.compare(password, findUser.password)
        if (checkPassword) {
            SuccessResponse(res, { email: email, password: password, find: findUser })
        } else {
            ClientErrorResponse(res, Messages.auth.login.checkPassword)
        }
    } else {
        ClientErrorResponse(res, Messages.auth.login.userExits)
    }
}
