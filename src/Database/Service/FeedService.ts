import { Feed } from '@Entity/Feed'
import { FeedImage } from '@Entity/FeedImage'
import AppDataSource from '@Database/AppDataSource'
import { toMySqlDatetime } from '@Commons/Helper'
import { DeleteResult, UpdateResult } from 'typeorm'

const feedRepository = AppDataSource.getRepository(Feed)
const feedImageRepository = AppDataSource.getRepository(FeedImage)

/**
 * 피드 등록
 * @param user_id
 * @param content
 
 */
export const saveFeed = async ({ user_id, content }: { user_id: number; content: string }): Promise<Feed> => {
    return feedRepository.save(
        {
            user_id: user_id,
            content: content,
        },
        { transaction: false, data: false },
    )
}

/**
 * 피드 수정
 * @param feed
 * @param content
 
 */
export const updateFeed = async ({ feed, content }: { feed: number; content: string }): Promise<UpdateResult> => {
    return feedRepository.update(
        { id: feed },
        {
            content: content,
            updated_at: toMySqlDatetime(new Date()),
        },
    )
}

/**
 * 피드 이미지 등록
 * @param feed_id
 * @param feed_image_id
 
 */
export const saveFeedImage = async ({ feed_id, feed_image_id }: { feed_id: number; feed_image_id: number }): Promise<FeedImage> => {
    return feedImageRepository.save(
        {
            feed_id: feed_id,
            feed_image_id: feed_image_id,
        },
        { transaction: false, data: false },
    )
}
export const deleteFeedImage = async ({ feed_id }: { feed_id: number }): Promise<DeleteResult> => {
    return feedImageRepository.delete({
        feed_id: feed_id,
    })
}

export const feedExits = async ({ id, user_id }: { id: number; user_id: number }): Promise<number> => {
    const task = await feedRepository.find({ select: ['id'], where: { id: id, user_id: user_id } })

    return task.length
}
