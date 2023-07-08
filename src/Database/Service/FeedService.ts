import { Feed } from '@Entity/Feed'
import { FeedImage } from '@Entity/FeedImage'
import AppDataSource from '@Database/AppDataSource'

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
