import { Users } from '@Entity/Users'
import AppDataSource from '@Database/AppDataSource'
import { toMySqlDatetime } from '@Helper'
import { UpdateResult, Not } from 'typeorm'

const userRepository = AppDataSource.getRepository(Users)

/**
 * 이메일 중복 체크
 * @param email
 */
export const emailExits = async ({ email }: { email: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { email: email } })

    return task.length
}

/**
 * 닉네임 중복 체크
 * @param nickname
 * @param user_id
 */
export const nickNameExits = async ({ user_id, nickname }: { user_id: number; nickname: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { id: Not(user_id), nickname: nickname } })

    return task.length
}

/**
 * 사용자 등록
 * @param type
 * @param level
 * @param status
 * @param email
 * @param password
 * @param nickname
 */
export const userCreate = async ({
    type,
    level,
    status,
    email,
    password,
    nickname,
}: {
    type: string
    level: string
    status: string
    email: string
    password: string
    nickname: string
}): Promise<Users> => {
    return userRepository.save(
        {
            type: type,
            level: level,
            status: status,
            email: email,
            password: password,
            nickname: nickname,
        },
        { transaction: false, data: false },
    )
}

/**
 * 이메인 인증 처리.
 * @param id
 */
export const emailVerified = async ({ id }: { id: number }): Promise<UpdateResult> => {
    return userRepository.update({ id: id }, { status: '020020', email_verified_at: toMySqlDatetime(new Date()) })
}

/**
 * 로그인용 회원 정보 조회
 * @param email
 */
export const getUserForLogin = async ({ email }: { email: string }): Promise<Users | null> => {
    return await userRepository.findOne({
        select: [`id`, `email`, 'password', `status`, 'nickname'],
        where: { email: email },
        relations: ['emailauth'],
    })
}

/**
 * 사용자 닉네임 변경
 * @param user_id
 * @param nickname
 */
export const updateNickName = async ({ user_id, nickname }: { user_id: number; nickname: string }): Promise<UpdateResult> => {
    return userRepository.update(
        { id: user_id },
        {
            nickname: nickname,
            updated_at: toMySqlDatetime(new Date()),
        },
    )
}

/**
 * 사용자 프로필 정보
 * @param user_id
 */
export const getUserProfile = async ({ user_id }: { user_id: number }): Promise<Users | null> => {
    return await userRepository.findOne({
        select: [`id`, `email`, 'nickname'],
        where: { id: user_id },
        relations: ['profile', 'profile.media', 'profile.code'],
    })
}


/**
 * 사용자 프로필 정보
 * @param nickname
 */
export const getUserProfileByNickname = async ( nickname: string ): Promise<Users | null> => {
    return await userRepository.findOne({
        select: [`id`, `email`, 'nickname'],
        where: { nickname: nickname },
        relations: ['profile', 'profile.media', 'profile.code'],
    })
}
