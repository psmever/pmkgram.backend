import { Request, Response } from 'express'
import { ClientErrorResponse, SuccessResponse } from '@Commons/ResponseProvider'
import { Logger } from '@Logger'
import _ from 'lodash'
import Messages from '@Messages'
// import { v4 as uuidv4 } from 'uuid'
import { UploadedFile } from 'express-fileupload'
import ssc from 'ssh2-sftp-client'
import Config from '@Config'

export const ImageCreate = async (req: Request, res: Response): Promise<void> => {
    const imageFile = !_.isEmpty(req.files?.image) ? (req.files?.image as UploadedFile) : null
    // const newImageFilename = uuidv4()

    // TODO: 이미지 업로드 마무리.
    if (imageFile) {
        Logger.console(imageFile.name)
        Logger.console(imageFile.tempFilePath)

        // const destFilePath = `${Config.SFTP_FILE_DEST_PATH}`
        // const destFileName = `${newImageFilename}.jpg`

        const sftp = new ssc()

        await sftp.connect({
            host: Config.SFTP_HOST,
            port: Config.SFTP_PORT,
            username: Config.SFTP_USERNAME,
            password: Config.SFTP_PASSWORD,
        })

        // await sftp.put(imageFile.tempFilePath, `${Config.SFTP_FILE_DEST_PATH}/${newImageFilename}.jpg`)

        SuccessResponse(res, { app: req.app.get('AppRootDir'), dirname: __dirname, imageFile: imageFile })
    } else {
        ClientErrorResponse(res, Messages.error.emptyImageFile)
    }
}
