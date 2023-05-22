#!/usr/bin/env node
import { Users } from '@Entity/Users'
import { DataBaseConnent } from '@Database/DataBaseConnent'
import bcrypt from 'bcrypt'
import Config from '@Config'
import { exit } from 'node:process'

console.debug(`######################################################################`)
;(async () => {
    const serviceDS = await DataBaseConnent
    const nowDateTime = new Date(new Date(new Date(new Date()).toISOString()).getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')

    if (serviceDS) {
        const userRepository = await serviceDS.getRepository(Users)
        const task = await userRepository.insert({
            type: `010030`,
            level: `030010`,
            status: `020020`,
            email: `pmk@pmkgram.co.kr`,
            password: bcrypt.hashSync(`password`, Number(Config.BCRYPT_SALTROUNDS)),
            nickname: `pmk`,
            email_verified_at: nowDateTime,
        })

        console.debug(task)
    }

    console.debug(`######################################################################`)
    exit()
})()
