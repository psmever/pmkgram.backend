#!/usr/bin/env node
import MysqlConnect from '@Database/MysqlConnect'
import bcrypt from 'bcrypt'
import Config from '@Config'
import { exit } from 'node:process'
import { Logger } from '@Commons/Logger'

console.debug(`######################################################################`)
;(async () => {
    const conn = await MysqlConnect.getConnection()
    const [result] = await conn.query(
        `insert into users 
                (type, level, status, email, password, nickname, email_verified_at, updated_at, created_at) 
             values 
             (
                '010030', '030010', '020020', 'pmk@pmkgram.co.kr', '${bcrypt.hashSync(`password`, Config.BCRYPT_SALT)}', 'pmk', now(), now(), now()
             );`,
    )
    if (!result) {
        Logger.consoleError('seed insert error...')
        exit()
    } else {
        Logger.info('success........')
    }

    console.debug(`######################################################################`)
    exit()
})()
