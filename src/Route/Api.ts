import { Router } from 'express'
import { Default } from '@Controllers/Api/TestController'
import { CheckStatus, BaseData, ErrorTest } from '@Controllers/Api/SystemController'
import { Register, EmailExits, Login, Logout, TokenRefresh, TokenInfo } from '@Controllers/Api/AuthController'
import { RestAuthenticateMiddleware } from '@Middlewares/RestAuthenticateMiddleware'

export const TestsRouter = Router()
export const SystemRouter = Router()
export const AuthRouter = Router()

/* 테스트 Router */
TestsRouter.get('/default', Default)

/* System Router */
SystemRouter.get('/check-status', CheckStatus)
SystemRouter.get('/base-data', BaseData)
SystemRouter.get('/error-test', ErrorTest)

/* Auth Router */
// email 중복 체크
AuthRouter.get('/:email/email-exits', EmailExits)
// 인증
AuthRouter.post('/register', Register)
// 로그인
AuthRouter.post('/login', Login)
// 로그아웃
AuthRouter.get('/logout', Logout)
// 토큰 refresh
AuthRouter.post('/token-refresh', TokenRefresh)
// 토큰 정보
AuthRouter.post('/token-info', RestAuthenticateMiddleware, TokenInfo)
