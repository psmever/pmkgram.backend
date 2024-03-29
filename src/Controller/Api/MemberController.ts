import { Request, Response } from 'express'
import { ClientErrorResponse, SuccessDefault, SuccessResponse } from '@Commons/ResponseProvider'
import _ from 'lodash'
import { Logger } from '@Logger'
import { nickNameExits, updateNickName, getUserProfile, getUserProfileByNickname } from '@Service/UserService'
import { updateProfile, updateProfileImage } from '@Service/ProfileService'
import { mediaExits } from '@Service/MediaService'
import Messages from '@Messages'
import Config from '@Config'

// 내 프로필
export const MyProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id

    const infoTask = await getUserProfile({ user_id: userId })
    if (infoTask && infoTask.profile && infoTask.profile.media) {
        return SuccessResponse(res, {
            email: infoTask.email,
            nickname: infoTask.nickname,
            profile_image: {
                id: infoTask.profile.profile_image_id,
                url: `${Config.MEDIA_HOSTNAME}${infoTask.profile.media.path}/${infoTask.profile.media?.filename}`,
            },
            gender: {
                name: infoTask.profile.code?.name,
                code_id: infoTask.profile.code?.code_id,
            },
            intro: infoTask.profile.intro,
        })
    } else {
        return ClientErrorResponse(res)
    }
}

// 닉네임으로 내 프로필
export const MyProfileByNickname = async (req: Request, res: Response): Promise<Response> => {
    const { nickname } = req.params
    const getUserId = await getUserProfileByNickname(nickname)

    let infoTask

    if (getUserId) {
        infoTask = await getUserProfile({ user_id: getUserId?.id })
    }

    if (infoTask && infoTask.profile && infoTask.profile.media) {
        return SuccessResponse(res, {
            email: infoTask.email,
            nickname: infoTask.nickname,
            profile_image: {
                id: infoTask.profile.profile_image_id,
                url: `${Config.MEDIA_HOSTNAME}${infoTask.profile.media.path}/${infoTask.profile.media?.filename}`,
            },
            gender: {
                name: infoTask.profile.code?.name,
                code_id: infoTask.profile.code?.code_id,
            },
            intro: infoTask.profile.intro,
        })
    } else {
        return ClientErrorResponse(res)
    }
}

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
    const { profileImage, nickname, gender, intro } = req.body
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
    if (_.isNumber(profileImage)) {
        const checkMedia = await mediaExits({ user_id: userId, id: profileImage })
        if (checkMedia === 0) {
            Logger.error(`ProfileEdit: checkMedia error`)
            return ClientErrorResponse(res, Messages.member.profile.imageCheckError)
        }

        await updateProfileImage({ user_id: userId, media: profileImage })
    }

    await updateNickName({ user_id: userId, nickname: nickname })

    await updateProfile({ user_id: userId, gender: gender, intro: intro })

    return SuccessDefault(res)
}
