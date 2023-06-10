import { Profile } from '@Entity/Profile'
import AppDataSource from '@Database/AppDataSource'

const profileRepository = AppDataSource.getRepository(Profile)

/**
 * 기본 프로필 등록
 */
export const createDefaultProfile = async ({ user_id }: { user_id: number }): Promise<Profile> => {
    return profileRepository.save(
        {
            user_id: user_id,
            profile_image_id: 1,
        },
        { transaction: false, data: false },
    )
}
