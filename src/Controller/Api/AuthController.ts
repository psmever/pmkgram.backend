import { Request, Response } from 'express'
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider'
import _ from 'lodash'
import Messages from '@Messages'
import { emailValidator } from '@Helper'
import { emailExits, userCreate } from '@Service/UserService'
import Config from '@Config'
import bcrypt from 'bcrypt'

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
    const { email, password } = req.body

    if (_.isEmpty(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailEmpty)
    }

    if (_.isEmpty(password)) {
        ClientErrorResponse(res, Messages.auth.register.passwordEmpty)
    }

    if (!emailValidator(email)) {
        ClientErrorResponse(res, Messages.auth.register.emailValidate)
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

        SuccessResponse(res, { email: task.email, nickname: task.nickname })
    }
}
