import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

const connToDatabase = async () => {
    const dataSourceConn = new DataSource({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
        logging: process.env.MYSQL_LOGGING === 'true',
        entities: [__dirname + '/Entities/*.ts'],
        migrations: [__dirname + '/Migrations/*.ts'],
        subscribers: [],
    })
    try {
        await dataSourceConn.initialize()
        console.log('Data Source has been initialized!')
        return dataSourceConn
    } catch (err) {
        console.error('Error during Data Source initialization', err)
    }
}

export const DataBaseSource = connToDatabase()
