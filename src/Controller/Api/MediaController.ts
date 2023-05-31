import { Request, Response } from 'express'
import { ClientErrorResponse, SuccessResponse, ServerErrorResponse, AuthenticateErrorResponse } from '@Commons/ResponseProvider'
import { Logger } from '@Logger'
import _ from 'lodash'
import Messages from '@Messages'
import { v4 as uuidv4 } from 'uuid'
import { UploadedFile } from 'express-fileupload'
import ssc from 'ssh2-sftp-client'
import Config from '@Config'
import { getFileExtension, generateRandomLetter } from '@Helper'
import { mediaCreate } from '@Service/MediaService'
import { tokenUser } from '@TokenManager'

export const ImageCreate = async (req: Request, res: Response): Promise<void> => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token) {
        const user = await tokenUser({ token: token })
        if (user.status && user.userid) {
            const imageFile = !_.isEmpty(req.files?.image) ? (req.files?.image as UploadedFile) : null

            if (imageFile) {
                const newImageFilename = uuidv4()
                const fileExtension = getFileExtension(imageFile.name)
                const targetFileName = `${newImageFilename}.${fileExtension}`
                const randomDestPath = generateRandomLetter()

                const targetDestPath = `${Config.SFTP_FILE_DEST_PATH_ROOT}/${Config.SFTP_FILE_DEST_PATH}/${randomDestPath}`
                const targetDestSmallPath = `${Config.SFTP_FILE_DEST_PATH}/${randomDestPath}`

                const sftp = new ssc()

                await sftp.connect({
                    host: Config.SFTP_HOST,
                    port: Number(Config.SFTP_PORT),
                    username: Config.SFTP_USERNAME,
                    password: Config.SFTP_PASSWORD,
                })

                const checkDirectory = await sftp.exists(`${targetDestPath}`)
                if (!checkDirectory) {
                    await sftp.mkdir(`${targetDestPath}`)
                }

                const result = await sftp.put(imageFile.tempFilePath, `${targetDestPath}/${targetFileName}`)

                if (result) {
                    const mediaCreateTask = await mediaCreate({
                        user_id: user.userid,
                        type: imageFile.mimetype,
                        filename: targetFileName,
                        origin_name: imageFile.name,
                        path: targetDestSmallPath,
                        size: imageFile.size,
                    })

                    SuccessResponse(res, {
                        id: mediaCreateTask.id,
                        original_name: imageFile.name,
                        mimetype: imageFile.mimetype,
                        filename: targetFileName,
                        media_url: `${Config.MEDIA_HOSTNAME}${targetDestSmallPath}/${targetFileName}`,
                    })
                } else {
                    Logger.error(JSON.stringify(result))
                    ServerErrorResponse(res)
                }
            } else {
                ClientErrorResponse(res, Messages.error.emptyImageFile)
            }
        } else {
            AuthenticateErrorResponse(res)
        }
    } else {
        AuthenticateErrorResponse(res)
    }
}
