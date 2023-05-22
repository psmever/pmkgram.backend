import { Users } from '@Entity/Users'
import AppDataSource from '@Database/AppDataSource'

const userRepository = AppDataSource.getRepository(Users)

/**
 * 이메일 중복 체크
 * @param email
 */
export const emailExits = async ({ email }: { email: string }): Promise<number> => {
    const task = await userRepository.find({ select: ['id'], where: { email: email } })

    return task.length
}
