import { Feed } from '@Entity/Feed'
import { FeedImage } from '@Entity/FeedImage'
import AppDataSource from '@Database/AppDataSource'
import { toMySqlDatetime } from '@Commons/Helper'
import { DeleteResult, UpdateResult, LessThan, In } from 'typeorm'
import { FeedGreat } from '@Database/Entities/FeedGreat'
import Const from '@Const'
import _ from 'lodash'

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
 * 페이징 처리용 feed id 리스트 생성
 * typeorm 에서 relations 을 했을시 order by take 순서가 꼬여서 select 를 한번 더 한다.
 * @param perPage
 * @param lastId
 * @param userId
 */
export const getFeedListPaginationList = async ({
    perPage = Const.defaultPerPage,
    lastId,
    userId,
}: {
    perPage: number
    lastId?: number
    userId?: number
}): Promise<Array<Feed>> => {
    const sqlWhere = { status: `Y` }

    if (userId && userId > 0) {
        _.assign(sqlWhere, { user_id: userId })
    }

    if (lastId && lastId > 0) {
        _.assign(sqlWhere, { id: LessThan(lastId) })
    }

    return await feedRepository.find({
        select: [`id`],
        where: sqlWhere,
        order: {
            id: `DESC`,
        },
        take: perPage,
    })
}

/**
 * 배열 형태의 id를 이용 feed 리스트를 가지고 오기.
 * @param ids
 */
export const feedSelectListById = async ({ ids }: { ids: Array<number> }): Promise<Array<Feed>> => {
    const sqlWhere = { status: `Y` }

    if (ids && _.isArray(ids)) {
        _.assign(sqlWhere, { id: In(ids) })
    }

    return await feedRepository.find({
        select: [`id`, `content`, `created_at`],
        where: sqlWhere,
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
 * 메인 전체 리스트
 */
export const mainFeedFullList = async (): Promise<Array<Feed>> => {
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
