import Messages from '@Commons/Messages'
import { ClientErrorResponse, SuccessDefault } from '@Commons/ResponseProvider'
import { saveFeed, saveFeedImage } from '@Database/Service/FeedService'
import { Request, Response } from 'express'
import _ from 'lodash'
import { mediaExits } from '@Database/Service/MediaService'

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
    // const { feedImageId, content } = req.body
    // const userId = req.app.locals.user.user_id

    return SuccessDefault(res)
}
