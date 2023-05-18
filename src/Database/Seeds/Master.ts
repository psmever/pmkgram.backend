#!/usr/bin/env node
import _ from 'lodash'
import { DataBaseSource } from '@Database/DataBaseSource'
import { Codes as CodesEntity, CodeTypeEnum } from '@Entity/Codes'
import { exit } from 'node:process'
import Codes from '@Codes'

console.debug(`######################################################################`)
;(async () => {
    const serviceDS = await DataBaseSource
    if (serviceDS) {
        const codesRepository = await serviceDS.getRepository(CodesEntity)

        const codeData: Array<{ type: CodeTypeEnum; group_id: string; code_id: string; name: string }> = []

        _.forEach(Codes, (c) => {
            codeData.push({ type: `group` as CodeTypeEnum, group_id: c.id, code_id: ``, name: c.name })
            _.forEach(c.list, (l) => {
                codeData.push({
                    type: `code` as CodeTypeEnum,
                    group_id: c.id,
                    code_id: `${c.id}${l.id}`,
                    name: l.name,
                })
            })
        })

        await codesRepository.clear()

        for await (const code of codeData) {
            console.log(`group-id : ${code.group_id}\t code-id: ${code.code_id}\t name: ${code.name}`)
            const task = await codesRepository.insert({
                type: code.type as CodeTypeEnum,
                group_id: code.group_id,
                code_id: code.code_id,
                name: code.name,
            })
            if (!task) {
                console.debug('seed insert error...')
                exit()
            }
        }
    }

    console.debug(`######################################################################`)
    exit()
})()
