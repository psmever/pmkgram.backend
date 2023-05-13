import { Entity, PrimaryColumn, Column } from 'typeorm'

export type BookFormat = 'group' | 'code'

export enum CodeTypeEnum {
    GROUP = 'group',
    CODE = 'code',
}

@Entity()
export default class Codes {
    @PrimaryColumn()
    id: number

    @Column({ type: `enum`, nullable: false, enum: CodeTypeEnum })
    type: CodeTypeEnum

    @Column({ type: `varchar`, nullable: false })
    group_id: string

    @Column({ type: `varchar`, nullable: false })
    code_id: string

    @Column({ type: `varchar`, nullable: false })
    name: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string
}
