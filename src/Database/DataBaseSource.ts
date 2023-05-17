import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

// const AppDataSource = new DataSource({
//     type: 'mysql',
//     host: process.env.MYSQL_HOST,
//     port: Number(process.env.MYSQL_PORT),
//     username: process.env.MYSQL_USERNAME,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     synchronize: true,
//     logging: false,
//     entities: [__dirname + '/Entities/*.ts'],
//     migrations: [__dirname + '/Migrations/*.ts'],
//     subscribers: [],
// })
//
// AppDataSource.initialize()
//     .then(() => {
//         console.log('Data Source has been initialized!')
//     })
//     .catch((err) => {
//         console.error('Error during Data Source initialization', err)
//     })

const connToDS = async () => {
    const dataSourceConn = new DataSource({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        synchronize: true,
        logging: process.env.APP_ENV !== 'production',
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

export const DataBaseSource = connToDS()

// export default AppDataSource
