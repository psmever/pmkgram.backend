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
    const envFileExits = fs.existsSync('.env')

    if (!envFileExits) {
        return {
            state: false,
            message: `Environment File not found...`,
        }
    }

    const ConfigList: string[] = Object.keys(Config)

    const envCheck = ConfigList.map((e) => {
        if (_.has(Config, e) && _.isEmpty(String(_.get(Config, e)))) {
            return e
        }
    }).filter((e) => e)

    if (envCheck.length > 0) {
        return {
            state: false,
            message: `${envCheck.join(', ')} Environment Not Found...........`,
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
    const port = Number(Config.PORT)
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
