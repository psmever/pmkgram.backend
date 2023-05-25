import { Users } from '@Entity/Users'
import AppDataSource from '@Database/AppDataSource'
import { toMySqlDatetime } from '@Helper'
import { UpdateResult } from 'typeorm'

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

export const getUserForLogin = async ({ email }: { email: string }): Promise<Users | null> => {
    return await userRepository.findOne({
        select: [`id`, `email`, 'password', `status`, 'nickname'],
        where: { email: email },
    })
}
