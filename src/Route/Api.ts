import { Router } from 'express'
import { Default } from '@Controllers/Api/TestController'
import { CheckStatus, BaseData, ErrorTest } from '@Controllers/Api/SystemController'
import { Register, EmailExits, Login, Logout, TokenRefresh, TokenInfo } from '@Controllers/Api/AuthController'
import { RestAuthenticateMiddleware } from '@Middlewares/RestAuthenticateMiddleware'
import { ImageCreate } from '@Controllers/Api/MediaController'
import { ProfileEdit, NickNameExits, MyProfile, MyProfileByNickname } from '@Controllers/Api/MemberController'
import { DeleteFeed, SaveFeed, UpdateFeed, MainList, FixGreat, MyPersonalList, NicknamePersonalList } from '@Controllers/Api/FeedController'

export const TestsRouter = Router()
export const SystemRouter = Router()
export const AuthRouter = Router()
export const MediaRouter = Router()
export const MemberRouter = Router()
export const FeedRouter = Router()

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
AuthRouter.get('/token-info', RestAuthenticateMiddleware, TokenInfo)

/* Media Router */
MediaRouter.post('/image-create', RestAuthenticateMiddleware, ImageCreate)

/* Member Router */
MemberRouter.get('/my-profile', RestAuthenticateMiddleware, MyProfile)
MemberRouter.get('/:nickname/my-profile', RestAuthenticateMiddleware, MyProfileByNickname)
MemberRouter.get('/:nickname/nickname-exits', RestAuthenticateMiddleware, NickNameExits)
MemberRouter.post('/profile-update', RestAuthenticateMiddleware, ProfileEdit)

/* Feed Router */
FeedRouter.post('/feed-save', RestAuthenticateMiddleware, SaveFeed)
FeedRouter.put('/feed-update', RestAuthenticateMiddleware, UpdateFeed)
FeedRouter.delete(`/:feed([0-9]+)/feed-delete`, RestAuthenticateMiddleware, DeleteFeed)
FeedRouter.get(`/feed-list`, MainList)
FeedRouter.get(`/my-feed-list`, RestAuthenticateMiddleware, MyPersonalList)
FeedRouter.get(`/:nickname/feed-list`, RestAuthenticateMiddleware, NicknamePersonalList)
FeedRouter.put(`/:feed([0-9]+)/great`, RestAuthenticateMiddleware, FixGreat)
