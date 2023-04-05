## pmkgram.backend

### 초기 설정 참고

> [Setting up Node JS, Express, Prettier, ESLint and Husky Application with Babel and Typescript: Part 1](https://dev.to/mkabumattar/setting-up-node-js-express-prettier-eslint-and-husky-application-with-babel-and-typescript-part-1-2ple).

## 로컬 개발 환경

```bash
touch .env

> .env example
APP_NAME=${APP_NAME}
NODE_ENV=${NODE_ENV}
APP_ENV=${APP_ENV}
PORT=${PORT}
HOSTNAME=${HOSTNAME}

MYSQL_HOST=${MYSQL_HOST}
MYSQL_PORT=${MYSQL_PORT}
MYSQL_DATABASE=${MYSQL_DATABASE}
MYSQL_USERNAME=${MYSQL_USERNAME}
MYSQL_PASSWORD=${MYSQL_PASSWORD}
MYSQL_DIALECT=${MYSQL_DIALECT}

> ./project env 파일 생성
develop.environment.env
production.environment.env

# yarn install

# yarn start:dev
```



