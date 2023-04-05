import express, { Application } from 'express'
import path from 'path'
import _ from 'lodash'
import fs from 'fs'
import { TestsRouter } from '@Routes/Api'
import { WebRouter } from '@Routes/Web'
import { Logger } from '@Logger'
import Config from '@Config'

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

const addRouters = (app: Application): void => {
    const baseApiRoute = '/api'
    // const baseWebRoute = '/web'

    app.use(`${baseApiRoute}/tests`, TestsRouter)
    app.use(`/`, WebRouter)
}

// 서버 초기화 설정.
export function initServer(app: Application, Path: string): void {
    app.set('view engine', 'pug')
    app.set('views', path.join(Path, 'Resources/view'))
    app.use(express.static(path.join(Path, 'Resources/public')))

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
