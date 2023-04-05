import express, { Application } from 'express'
import { Logger } from '@Commons/Logger'
import * as Server from '@Servers/Server'

const app: Application = express()

app.locals.env = process.env

const checkResult = Server.checkEnvironment()

if (checkResult.state) {
    Server.initServer(app, __dirname)
    Server.startServer(app)
} else {
    console.clear()
    Logger.consoleError(`\n\nStart Server Error: ${checkResult.message}\n`)
}
