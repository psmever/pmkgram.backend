import express, { Application } from 'express'
import { Logger } from '@Commons/Logger'
import * as Server from '@Servers/Server'

const app: Application = express()

const checkResult = Server.checkEnvironment()

if (checkResult.state) {
  Server.initServer(app)
  Server.startServer(app)
} else {
  console.clear()
  Logger.consoleError(`\n\nStart Server Error: ${checkResult.message}\n`)
}
