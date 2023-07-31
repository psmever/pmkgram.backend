import { Profile } from '@Entity/Profile'
import AppDataSource from '@Database/AppDataSource'
import { toMySqlDatetime } from '@Helper'
import { UpdateResult } from 'typeorm'

const profileRepository = AppDataSource.getRepository(Profile)

/**
 * 기본 프로필 등록
 * @param user_id
 */
export const createDefaultProfile = async ({ user_id }: { user_id: number }): Promise<Profile> => {
    return profileRepository.save(
        {
            user_id: user_id,
            profile_image_id: 1,
            gender: '050010',
        },
        { transaction: false, data: false },
    )
}

/**
 * 프로필 이미지 변경
 * @param user_id
 * @param media
 */
export const updateProfileImage = async ({ user_id, media }: { user_id: number; media: number }): Promise<UpdateResult> => {
    return profileRepository.update(
        { user_id: user_id },
        {
            profile_image_id: media,
            updated_at: toMySqlDatetime(new Date()),
        },
    )
}
