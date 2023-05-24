import dotenv from 'dotenv'

dotenv.config()

export default {
    APP_NAME: process.env.APP_NAME,
    NODE_ENV: process.env.NODE_ENV,
    APP_ENV: process.env.APP_ENV,
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    MYSQL_USERNAME: process.env.MYSQL_USERNAME,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_DIALECT: process.env.MYSQL_DIALECT,
    MYSQL_PORT: process.env.MYSQL_PORT,
    BCRYPT_SALTROUNDS: process.env.BCRYPT_SALTROUNDS,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY,
}
