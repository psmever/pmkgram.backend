import { Router } from 'express'
import { Default } from '@Controllers/Api/TestController'
import { CheckStatus, BaseData } from '@Controllers/Api/SystemController'
import { Register } from '@Controllers/Api/AuthController'

export const TestsRouter = Router()
export const SystemRouter = Router()
export const AuthRouter = Router()

// 기본 테스트.
TestsRouter.get('/default', Default)

// 시스템
SystemRouter.get('/check-status', CheckStatus)
SystemRouter.get('/base-data', BaseData)

// 인증
AuthRouter.post('/register', Register)
