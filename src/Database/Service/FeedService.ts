import { Feed } from '@Entity/Feed'
import { FeedImage } from '@Entity/FeedImage'
import AppDataSource from '@Database/AppDataSource'
import { toMySqlDatetime } from '@Commons/Helper'
import { DeleteResult, UpdateResult } from 'typeorm'
import { FeedGreat } from '@Database/Entities/FeedGreat'

const feedRepository = AppDataSource.getRepository(Feed)
const feedGreatRepository = AppDataSource.getRepository(FeedGreat)
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

/**
 * 피드 이미지 삭제
 * @param feed_id
 */
export const deleteFeedImage = async ({ feed_id }: { feed_id: number }): Promise<DeleteResult> => {
    return feedImageRepository.delete({
        feed_id: feed_id,
    })
}

/**
 * 피드 삭제
 * @param feed_id
 */
export const deleteFeed = async ({ feed_id }: { feed_id: number; status: string }): Promise<UpdateResult> => {
    return feedRepository.update(
        { id: feed_id },
        {
            status: 'N',
            updated_at: toMySqlDatetime(new Date()),
        },
    )
}

/**
 * 피드 유무 체크
 * @param id
 * @param user_id
 */
export const feedExits = async ({ id, user_id }: { id: number; user_id: number }): Promise<number> => {
    const task = await feedRepository.find({ select: ['id'], where: { id: id, user_id: user_id } })

    return task.length
}

/**
 * 메인 리스트
 */
export const mainFeedList = async (): Promise<Array<Feed>> => {
    return await feedRepository.find({
        select: [`id`, `content`, `created_at`],
        where: { status: `Y` },
        order: {
            id: `DESC`,
            comment: {
                id: `DESC`,
            },
            images: {
                id: `ASC`,
            },
        },
        relations: [`comment.user`, `images`, `images.media`, `great`, `user.profile.media`, `comment`],
    })
}

/**
 * 피드 좋아요 유무 체크
 * @param id
 * @param user_id
 */
export const feedGreatExits = async ({ id, user_id }: { id: number; user_id: number }): Promise<number> => {
    const task = await feedGreatRepository.find({ select: ['id'], where: { feed_id: id, user_id: user_id } })

    return task.length
}

/**
 * 피드 좋아요 등록
 * @param id
 * @param user_id
 */
export const saveFeedGreat = async ({ user_id, id }: { user_id: number; id: number }): Promise<FeedGreat> => {
    return feedGreatRepository.save(
        {
            user_id: user_id,
            feed_id: id,
        },
        { transaction: false, data: false },
    )
}

/**
 * 피드 좋아요 삭제
 * @param id
 * @param user_id
 */
export const deleteFeedGreat = async ({ user_id, id }: { user_id: number; id: number }): Promise<DeleteResult> => {
    return feedGreatRepository.delete({
        feed_id: id,
        user_id: user_id,
    })
}


export const personalFeedList = async (userId: number): Promise<Array<Feed>> => {

    return await feedRepository.find({
        select: [`id`, `content`, `created_at`],
        where: { status: `Y`, user_id:userId },
        order: {
            id: `DESC`,
            comment: {
                id: `DESC`,
            },
            images: {
                id: `ASC`,
            },
        },
        relations: [`comment.user`, `images`, `images.media`, `great`, `user`, `comment`],
    })
}
