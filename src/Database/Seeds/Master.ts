// import { Codes } from '@Entities'
import _ from 'lodash'

// codes
const codes = [
    { type: `group`, groupid: `0100`, name: `클라이언트` },
    { type: `group`, groupid: `0200`, name: `` },
]

console.debug(
    _.map(codes, (e) => {
        return e.name
    }),
)

// _.forEach(codes, (code) => {
// const CodeModel = new Codes()
// CodeModel.group_id = code.groupid
// CodeModel.type = code.type
// })
