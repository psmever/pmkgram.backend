import Messages from '@Commons/Messages'
import { ClientErrorResponse, SuccessDefault, SuccessResponse, ServerErrorResponse } from '@Commons/ResponseProvider'
import {
    deleteFeed,
    deleteFeedImage,
    feedExits,
    saveFeed,
    saveFeedImage,
    updateFeed,
    feedGreatExits,
    saveFeedGreat,
    deleteFeedGreat,
    getFeedListPaginationList,
    feedSelectListById,
    feedCommentSave,
    feedCommentList,
    personalFeedList,
} from '@Database/Service/FeedService'
import { getUserProfileByNickname } from '@Database/Service/UserService'
import { Request, Response } from 'express'
import _ from 'lodash'
import { mediaExits } from '@Database/Service/MediaService'
import { Logger } from '@Commons/Logger'
import { changeMysqlDate, addComma } from '@Helper'
import Config from '@Config'
import Const from '@Const'
import { Feed } from '@Entity/Feed'

// 피드 등록하기
export const SaveFeed = async (req: Request, res: Response): Promise<Response> => {
    const { feedImageId, content } = req.body
    const userId = req.app.locals.user.user_id

    // 내용 체크
    if (_.isEmpty(content)) {
        return ClientErrorResponse(res, Messages.feed.emptyFeedContent)
    }

    // 이미지 체크 [배열]X
    if (!_.isArray(feedImageId)) {
        return ClientErrorResponse(res, Messages.feed.imageArrayError)
    }

    if (!_.isEmpty(feedImageId)) {
        const imageCheckResult: string[] = []
        for await (const id of feedImageId) {
            const checkMedia = await mediaExits({ user_id: userId, id: id })
            if (checkMedia === 0) {
                imageCheckResult.push(`error`)
            } else {
                imageCheckResult.push(`success`)
            }
        }
        if (_.includes(imageCheckResult, 'error')) {
            return ClientErrorResponse(res, Messages.feed.emptyFeedImage)
        } else {
            const feedTask = await saveFeed({ user_id: userId, content: content })

            for await (const id of feedImageId) {
                await saveFeedImage({ feed_id: feedTask.id, feed_image_id: id })
            }
        }
    }

    return SuccessDefault(res)
}

// 피드 수정하기
export const UpdateFeed = async (req: Request, res: Response): Promise<Response> => {
    const { feed, feedImageId, content } = req.body
    const userId = req.app.locals.user.user_id

    // 피드 유무 체크
    if (!_.isEmpty(feed)) {
        const checkFeed = await feedExits({ user_id: userId, id: feed })
        if (checkFeed === 0) {
            Logger.error(`UpdateFeed: checkFeed error`)
            return ClientErrorResponse(res, Messages.feed.feedCheckError)
        }
    }
    // 피드의 유저 아이디 체크( 피드 유 row의 유저아이디 = 로그인 유저 아이디)

    // 내용 체크(빈값 체크  - 빈값이면 에러)
    if (_.isEmpty(content)) {
        return ClientErrorResponse(res, Messages.feed.emptyFeedContent)
    }
    // 이미지 체크 [배열]X
    if (!_.isArray(feedImageId)) {
        return ClientErrorResponse(res, Messages.feed.imageArrayError)
    }
    // 이미지 데이터 유무 체크
    if (!_.isEmpty(feedImageId)) {
        const imageCheckResult: string[] = []
        for await (const id of feedImageId) {
            const checkMedia = await mediaExits({ user_id: userId, id: id })
            if (checkMedia === 0) {
                imageCheckResult.push(`error`)
            } else {
                imageCheckResult.push(`success`)
            }
        }
        if (_.includes(imageCheckResult, 'error')) {
            return ClientErrorResponse(res, Messages.feed.emptyFeedImage)
        } else {
            // 피드 수정
            await updateFeed({ feed: feed, content: content })
        }
        // 이미지 삭제(피드 값으로 된 피드 이미지 삭제)
        await deleteFeedImage({ feed_id: feed })

        // 이미지 재등록
        for await (const id of feedImageId) {
            await saveFeedImage({ feed_id: feed, feed_image_id: id })
        }
    }
    // - 로그인 계정 체크 (로그인 계정 =이미지 업로드 user_id)

    return SuccessDefault(res)
}

// 피드 삭제하기
export const DeleteFeed = async (req: Request, res: Response): Promise<Response> => {
    const { feed } = req.params
    const userId = req.app.locals.user.user_id

    const taskFeed = Number(feed)

    // 핃드 데이터 유무 체크
    if (!_.isEmpty(feed)) {
        const checkFeed = await feedExits({ user_id: userId, id: taskFeed })
        if (checkFeed === 0) {
            Logger.error(`UpdateFeed: checkFeed error`)
            return ClientErrorResponse(res, Messages.feed.feedCheckError)
        }
        // // 피드 이미지 삭제
        await deleteFeedImage({ feed_id: taskFeed })

        // // 피드 삭제
        await deleteFeed({ feed_id: taskFeed, status: 'N' })
    }

    return SuccessDefault(res)
}

/**
 * 피드 리스트용 payload 새성
 * @param feeds
 */
const generateFeedList = (
    feeds: Array<Feed>,
): Array<{
    id: number
    user: {
        id: number | null
        nickname: string | null
        image: string | null
    }
    contents: string
    images: Array<{
        filename: string | null
        path: string | null
        url: string | null
    }>
    great: {
        number: number
        string: string
    }
    mygreat: boolean
    comment: Array<{
        id: number
        user: {
            id: number
            nickname: string | null
        }
        comment: string
        time: {
            origin: Date
            step1: string
        }
    }>
    time: {
        origin: Date
        step1: string
        sinceString: string
    }
}> => {
    return _.map(feeds, (feed) => {
        // payload 조합
        const feedDate = changeMysqlDate(feed.created_at)
        return {
            id: feed.id,
            user: {
                id: feed.user ? feed.user.id : null,
                nickname: feed.user ? feed.user.nickname : null,
                image:
                    feed.user && feed.user.profile && feed.user.profile.media
                        ? `${Config.MEDIA_HOSTNAME}${feed.user.profile.media.path}/${feed.user.profile.media.filename}`
                        : null,
            },
            contents: feed.content,
            images: _.map(feed.images, (fi) => {
                const url = fi.media && fi.media.path ? `${Config.MEDIA_HOSTNAME}${fi.media.path}/${fi.media.filename}` : null

                return {
                    filename: fi.media && fi.media.filename ? fi.media.filename : null,
                    path: fi.media && fi.media.path ? fi.media.path : null,
                    url: url,
                }
            }),
            great: {
                number: feed.great && feed.great.length > 0 ? feed.great.length : 0,
                string: `${addComma(feed.great && feed.great.length > 0 ? feed.great.length : 0)}`,
            },
            mygreat: false,
            comment: _.map(feed.comment, (fc) => {
                const fcDate = changeMysqlDate(fc.created_at)
                return {
                    id: fc.id,
                    user: {
                        id: fc.user_id,
                        nickname: fc.user && fc.user.nickname ? fc.user.nickname : null,
                    },
                    comment: fc.comment,
                    time: {
                        origin: fcDate.origin,
                        step1: fcDate.format.step1,
                        sinceString: fcDate.format.sinceString,
                    },
                }
            }),
            time: {
                origin: feedDate.origin,
                step1: feedDate.format.step1,
                sinceString: feedDate.format.sinceString,
            },
        }
    })
}

// 메인 리스트.
export const MainList = async (req: Request, res: Response): Promise<Response> => {
    const { lastId } = req.params
    const mFeeds = await getFeedListPaginationList({ perPage: Const.defaultPerPage, lastId: Number(lastId) })
    const mFeed = await feedSelectListById({ ids: _.map(mFeeds, (id) => id.id) })
    const payload = generateFeedList(mFeed)

    return SuccessResponse(res, {
        pagination: {
            id: {
                first: _.get(_.first(mFeed), 'id'),
                last: _.get(_.last(mFeed), 'id'),
            },
            more: payload.length >= Const.defaultPerPage,
        },
        feed: generateFeedList(mFeed),
    })
}

// 피드 좋아요 등록/삭제.
export const FixGreat = async (req: Request, res: Response): Promise<Response> => {
    const { feed } = req.params
    const userId = req.app.locals.user.user_id

    const taskFeed = Number(feed)

    // 핃드 데이터 유무 체크
    if (!_.isEmpty(feed)) {
        const checkFeedGreat = await feedGreatExits({ user_id: userId, id: taskFeed })
        if (checkFeedGreat === 0) {
            // 피드 좋아요 INSERT
            await saveFeedGreat({ user_id: userId, id: taskFeed })
        } else {
            // 피드 좋아요 DELETE
            await deleteFeedGreat({ user_id: userId, id: taskFeed })
        }
    }
    return SuccessDefault(res)
}

// 개인홈 피드 리스트
export const MyPersonalList = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.app.locals.user.user_id
    const mFeeds = await getFeedListPaginationList({ perPage: Const.defaultPerPage, userId: userId })
    const mFeed = await feedSelectListById({ ids: _.map(mFeeds, (id) => id.id) })

    return SuccessResponse(res, generateFeedList(mFeed))
}

// 코멘트 추가
export const FeedCommentSave = async (req: Request, res: Response): Promise<Response> => {
    const { feedId: paramFeedId } = req.params
    const { comment } = req.body

    const userId = req.app.locals.user.user_id
    const feedId = Number(paramFeedId)

    // 내용 체크
    if (_.isEmpty(comment)) {
        return ClientErrorResponse(res, Messages.feed.emptyFeedComment)
    }

    const checkFeed = await feedExits({ id: feedId })
    if (checkFeed === 0) {
        Logger.error(`FeedCommentSave: checkFeed error`)
        return ClientErrorResponse(res, Messages.feed.feedCheckError)
    }

    const task = await feedCommentSave({ feedId: feedId, user_id: userId, comment: comment })

    if (task.id) {
        return SuccessDefault(res)
    } else {
        Logger.error(`FeedCommentSave: comment insert error`)
        return ServerErrorResponse(res)
    }
}

// 코멘트 리스트
export const FeedCommentList = async (req: Request, res: Response): Promise<Response> => {
    const { feedId: paramFeedId } = req.params
    const feedId = Number(paramFeedId)

    const task = await feedCommentList({ feedId: feedId })

    return SuccessResponse(
        res,
        _.map(task, (comment) => {
            const commentDate = changeMysqlDate(comment.created_at)
            return {
                id: comment.id,
                feedId: comment.feed_id,
                comment: comment.comment,
                user: {
                    id: comment.user ? comment.user.id : null,
                    nickname: comment.user ? comment.user.nickname : null,
                },
                time: {
                    origin: commentDate.origin,
                    step1: commentDate.format.step1,
                    sinceString: commentDate.format.sinceString,
                },
            }
        }),
    )
}

//닉네임 별 개인 피드리스트
export const NicknamePersonalList = async (req: Request, res: Response): Promise<Response> => {
    const { nickname } = req.params
    const getUserId = await getUserProfileByNickname(nickname)
    let mFeed

    if (getUserId) {
        mFeed = await personalFeedList(getUserId.id)
    }

    // TODO: 페이징 처리
    return SuccessResponse(
        res,
        _.map(mFeed, (feed) => {
            // payload 조합
            const feedDate = changeMysqlDate(feed.created_at)
            return {
                id: feed.id,
                contents: feed.content,
                images: _.map(feed.images, (fi) => {
                    const url = fi.media && fi.media.path ? `${Config.MEDIA_HOSTNAME}${fi.media.path}/${fi.media.filename}` : null

                    return {
                        filename: fi.media && fi.media.filename ? fi.media.filename : null,
                        path: fi.media && fi.media.path ? fi.media.path : null,
                        url: url,
                    }
                }),
                great: feed.great && feed.great.length > 0 ? feed.great.length : 0,
                mygreat: false,
                comment: _.map(feed.comment, (fc) => {
                    const fcDate = changeMysqlDate(fc.created_at)
                    return {
                        id: fc.id,
                        user: {
                            id: fc.user_id,
                            nickname: fc.user && fc.user.nickname ? fc.user.nickname : null,
                        },
                        comment: fc.comment,
                        time: {
                            origin: fcDate.origin,
                            step1: fcDate.format.step1,
                        },
                    }
                }),
                time: {
                    origin: feedDate.origin,
                    step1: feedDate.format.step1,
                },
            }
        }),
    )
}
