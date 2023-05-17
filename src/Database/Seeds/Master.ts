#!/usr/bin/env node

'use strict'
// import _ from 'lodash'
import { DataBaseSource } from '@Database/DataBaseSource'
import { Codes, CodeTypeEnum } from '@Entity/Codes'
import { exit } from 'node:process'

const CodeModel = new Codes()

// codes
const groupCodes = [
    { type: `group`, groupid: `010`, name: `클라이언트 구분` },
    { type: `group`, groupid: `020`, name: `회원 관련` },
]

const codes = [
    { type: `code`, groupid: `010`, codeid: `010`, name: `iOS` },
    { type: `code`, groupid: `010`, codeid: `020`, name: `android` },
    { type: `code`, groupid: `010`, codeid: `030`, name: `web` },
    { type: `code`, groupid: `020`, codeid: `010`, name: `인증 전 상태` },
    { type: `code`, groupid: `020`, codeid: `020`, name: `인증 완료` },
    { type: `code`, groupid: `020`, codeid: `030`, name: `접속 차단` },
]

const MasterSeed = async () => {
    const serviceDS = await DataBaseSource
    if (serviceDS) {
        const codesRepository = await serviceDS.getRepository(Codes)

        const groupCodeInsertPromises = groupCodes.map(async (group) => {
            CodeModel.type = group.type as CodeTypeEnum
            CodeModel.group_id = group.groupid
            CodeModel.code_id = ``
            CodeModel.name = group.name

            const groupTask = await codesRepository.insert({
                type: group.type as CodeTypeEnum,
                group_id: group.groupid,
                code_id: ``,
                name: group.name,
            })
            if (!groupTask) {
                console.debug('seed insert error...')
                exit()
            }

            const codeInsertPromises = codes
                .filter(async (f) => f.groupid === group.groupid)
                .map(async (c) => {
                    const codeTask = await codesRepository.insert({
                        type: c.type as CodeTypeEnum,
                        group_id: c.groupid,
                        code_id: c.codeid,
                        name: c.name,
                    })
                    if (!codeTask) {
                        console.debug('seed insert error...')
                        exit()
                    }
                })

            await Promise.all(codeInsertPromises)
        })

        await codesRepository.clear()
        await Promise.all(groupCodeInsertPromises)
    }

    return
}

MasterSeed().then(() => {
    console.debug('!!!!!!!!!!!!!!!!!!!!!!!!!!!end!!!!!!!!!!!!!!!!!!!!')
    exit()
})
