import { Application } from 'express'
import { TestsRouter } from '../Routes/Api'
import { Logger } from '../Common/Logger'

const addRouters = (app: Application): void => {
  const baseApiRoute = '/api'

  app.use(`${baseApiRoute}/tests`, TestsRouter)
}

// 서버 초기화 설정.
export function initServer(app: Application): void {
  addRouters(app)

  return
}

// 서버 시작.
export function startServer(app: Application): void {
  const port = 3000
  const appName = `pmkgram.backend`
  const appEnv = `local`

  app.listen(port, () => Logger.info(`Express :: ${appName} ${appEnv} :: running on port ${port}\n`, null, true))
}
