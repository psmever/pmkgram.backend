import express, { Application } from 'express'
import path from 'path'
import _ from 'lodash'
import fs from 'fs'
import { TestsRouter, SystemRouter, AuthRouter, MediaRouter } from '@Routes/Api'
import { RestDefaultMiddleware } from '@Middlewares/RestDefaultMiddleware'
import { DefaultRouter as DefaultWebRouter, AuthRouter as AuthWebRouter } from '@Routes/Web'
import { Logger } from '@Logger'
import Config from '@Config'
import bodyParser from 'body-parser'
import cors from 'cors'
import fileupload from 'express-fileupload'

export const checkEnvironment = (): { state: boolean; message: string } => {
    const notFound: string[] = []

    const envFileExits = fs.existsSync('.env')

    if (!envFileExits) {
        return {
            state: false,
            message: `Environment APP_ENV not found...`,
        }
    }

    if (_.isEmpty(Config.APP_NAME)) notFound.push('APP_NAME')
    if (_.isEmpty(Config.NODE_ENV)) notFound.push('NODE_ENV')
    if (_.isEmpty(Config.APP_ENV)) notFound.push('APP_ENV')
    if (_.isEmpty(Config.PORT)) notFound.push('PORT')
    if (_.isEmpty(Config.HOSTNAME)) notFound.push('HOSTNAME')
    if (_.isEmpty(Config.MYSQL_HOST)) notFound.push('MYSQL_HOST')
    if (_.isEmpty(Config.MYSQL_PORT)) notFound.push('MYSQL_PORT')
    if (_.isEmpty(Config.MYSQL_DATABASE)) notFound.push('MYSQL_DATABASE')
    if (_.isEmpty(Config.MYSQL_USERNAME)) notFound.push('MYSQL_USERNAME')
    if (_.isEmpty(Config.MYSQL_PASSWORD)) notFound.push('MYSQL_PASSWORD')
    if (_.isEmpty(Config.MYSQL_LOGGING)) notFound.push('MYSQL_LOGGING')
    if (_.isEmpty(Config.MYSQL_SYNCHRONIZE)) notFound.push('MYSQL_SYNCHRONIZE')
    if (_.isEmpty(Config.GMAIL_USER)) notFound.push('GMAIL_USER')
    if (_.isEmpty(Config.GMAIL_PASSWORD)) notFound.push('GMAIL_PASSWORD')
    if (_.isEmpty(Config.SECRET_KEY)) notFound.push('SECRET_KEY')
    if (_.isEmpty(String(Config.BCRYPT_SALT))) notFound.push('BCRYPT_SALT')
    if (_.isEmpty(Config.ACCESS_TOKEN_EXPIRESIN)) notFound.push('ACCESS_TOKEN_EXPIRESIN')
    if (_.isEmpty(Config.REFRESH_TOKEN_EXPIRESIN)) notFound.push('REFRESH_TOKEN_EXPIRESIN')

    if (_.isEmpty(Config.SFTP_HOST)) notFound.push('SFTP_HOST')
    if (_.isEmpty(String(Config.SFTP_PORT))) notFound.push('SFTP_PORT')
    if (_.isEmpty(Config.SFTP_USERNAME)) notFound.push('SFTP_USERNAME')
    if (_.isEmpty(Config.SFTP_PASSWORD)) notFound.push('SFTP_PASSWORD')
    if (_.isEmpty(Config.SFTP_FILE_DEST_PATH)) notFound.push('SFTP_FILE_DEST_PATH')

    if (notFound.length > 0) {
        return {
            state: false,
            message: `${notFound.join(', ')} Environment Not Found...........`,
        }
    }

    return {
        state: true,
        message: `check end `,
    }
}

// 라우터 등록
const addRouters = (app: Application): void => {
    const baseApiRoute = '/api'
    const baseWebRoute = '/web'

    app.use(`${baseApiRoute}/tests`, TestsRouter)
    app.use(`${baseApiRoute}/system`, RestDefaultMiddleware, SystemRouter)
    app.use(`${baseApiRoute}/auth`, RestDefaultMiddleware, AuthRouter)
    app.use(`${baseApiRoute}/media`, RestDefaultMiddleware, MediaRouter)
    app.use(`/`, DefaultWebRouter)
    app.use(`${baseWebRoute}/auth`, AuthWebRouter)
}

// 서버 초기화 설정.
export function initServer(app: Application, Path: string): void {
    Logger.console(Path)
    Logger.console(path.resolve(__dirname))
    app.set('view engine', 'pug')
    app.set('views', path.join(Path, 'Resources/view'))
    app.set('AppRootDir', Path)
    app.use(express.static(path.join(Path, 'Resources/public')))

    app.use(
        cors({
            origin: '*',
        }),
    )

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(
        fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
        }),
    )

    addRouters(app)
    return
}

// 서버 시작.
export function startServer(app: Application): void {
    const port = Config.PORT
    const appName = Config.APP_NAME
    const appEnv = Config.APP_ENV

    app.listen(port, () =>
        Logger.info(
            `\n\nRunning Name  - ${appName}\nRunning Environment - ${appEnv}\nRunning on port - ${port}\n:: Server Start Success ::`,
            null,
            true,
        ),
    )
}
