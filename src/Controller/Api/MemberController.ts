import { Request, Response } from 'express'
import { ClientErrorResponse, SuccessDefault, SuccessResponse } from '@Commons/ResponseProvider'
import _ from 'lodash'
import { Logger } from '@Logger'
import { nickNameExits, updateNickName } from '@Service/UserService'
import { updateProfileImage } from '@Service/ProfileService'
import { mediaExits } from '@Service/MediaService'
import Messages from '@Messages'

// 닉네임 중복 확인
export const NickNameExits = async (req: Request, res: Response): Promise<Response> => {
    const { nickname } = req.params
    const userId = req.app.locals.user.user_id

    const checkString = decodeURIComponent(nickname)

    const checkTask = await nickNameExits({ user_id: userId, nickname: checkString })

    if (checkTask === 0) {
        return SuccessResponse(res, { nickname: checkString, exits: false })
    }

    return SuccessResponse(res, { nickname: checkString, exits: true })
}

// 프로필 변경
export const ProfileEdit = async (req: Request, res: Response): Promise<Response> => {
    const { profileImage, nickname } = req.body
    const userId = req.app.locals.user.user_id

    if (_.isEmpty(nickname)) {
        return ClientErrorResponse(res, Messages.member.profile.emptyNickName)
    }

    // 닉네임 중복 체크
    const checkNickNameExits = await nickNameExits({ user_id: userId, nickname: nickname })
    if (checkNickNameExits > 0) {
        return ClientErrorResponse(res, Messages.member.profile.exitsNickName)
    }

    // 이미지 업데이트
    if (!_.isEmpty(profileImage)) {
        const checkMedia = await mediaExits({ user_id: userId, id: profileImage })
        if (checkMedia === 0) {
            Logger.error(`ProfileEdit: checkMedia error`)
            return ClientErrorResponse(res, Messages.member.profile.imageCheckError)
        }

        await updateProfileImage({ user_id: userId, media: profileImage })
    }

    await updateNickName({ user_id: userId, nickname: nickname })

    return SuccessDefault(res)
}
