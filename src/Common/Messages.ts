export default {
    error: {
        defaultClientError: `잘못된 요청 입니다.`,
        clientTypeNotFound: `클라이언트 정보가 존재 하지 않습니다.`,
        serverError: `처리중 문제가 발생 했습니다.`,
        authenticateError: `로그인이 필요한 서비스 입니다.`,
        emptyImageFile: `이미지 파일을 등록해 주세요.`,
    },
    success: {
        default: `정상 처리 하였습니다.`,
    },
    auth: {
        register: {
            emailEmpty: `이메일 정보가 존재 하지 않습니다.`,
            passwordEmpty: `비밀번호 정보가 존재 하지 않습니다.`,
            emailValidate: `정확한 이메일 주소를 입력해 주세요.`,
            emailExits: `이미 사용중인 이메일 주소 입니다.`,
        },
        emailAuth: {
            authCodeExits: `존재 하지 않은 인증 코드 입니다.`,
            alreadyCode: `이미 인증을 완료했습니다.`,
            emptyUser: `사용자 정보가 존재 하지 않습니다.`,
            successSubApp: `앱으로 로그인 해주세요.`,
            successSubWeb: `웹으로 로그인 해주세요.`,
        },
        login: {
            userExits: `존재 하지 않는 회원 입니다.`,
            checkPassword: `패스워드를 확인해 주세요.`,
            mustEmailAuth: `인증 되지 않은 회원 입니다.`,
        },
        logout: {
            tokenVerifyError: `처리중 문제가 발생했습니다.`,
            checkPassword: `패스워드를 확인해 주세요.`,
        },
    },
    member: {
        profile: {
            emptyProfileImage: `프로필 이미지를 등록해 주세요.`,
            imageCheckError: `이미지 정보가 잘못 되었습니다`,
            emptyNickName: `닉네임을 등록해 주세요`,
            exitsNickName: `이미 사용중인 닉네임 입니다.`,
        },
    },
    feed: {
        emptyFeedContent: '피드 내용을 입력해 주세요.',
        imageCheckError: `이미지 정보가 잘못 되었습니다(001)`,
        imageArrayError: `이미지 정보가 잘못 되었습니다(002)`,
        emptyFeedImage: `피드 이미지를 등록해 주세요.`,
        feedCheckError: '피드 정보가 잘못되었습니다.',
    },
}
