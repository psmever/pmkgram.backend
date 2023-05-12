import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

export default new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/Entities/*.ts'],
    migrations: [__dirname + '/Migrations/*.ts'],
    subscribers: [],
})
