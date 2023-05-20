import { Request, Response } from 'express'
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider'
import _ from 'lodash'
import Messages from '@Messages'
import { emailValidator } from '@Helper'

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

    SuccessResponse(res, { test: 'test' })
}
