import AppDataSource from '@Database/AppDataSource'
import { Media } from '@Entity/Media'

const mediaRepository = AppDataSource.getRepository(Media)

export const mediaCreate = async ({
    user_id,
    type,
    path,
    filename,
    origin_name,
    size,
}: {
    user_id: number
    type: string
    path: string
    filename: string
    origin_name: string
    size: number
}): Promise<Media> => {
    return mediaRepository.save(
        {
            user_id: user_id,
            type: type,
            path: path,
            filename: filename,
            origin_name: origin_name,
            size: size,
        },
        { transaction: false, data: false },
    )
}
