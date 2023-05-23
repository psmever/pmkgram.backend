import { Router } from 'express'
import { Default } from '@Controllers/Web/DefaultController'
import { EnailAuth } from '@Controllers/Web/AuthController'

export const DefaultRouter = Router()
export const AuthRouter = Router()

// 기본 테스트.
DefaultRouter.get('/', Default)

// 이메일 인증
AuthRouter.get('/emailauth/:authCode', EnailAuth)
