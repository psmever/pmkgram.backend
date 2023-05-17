import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

export enum CodeTypeEnum {
    GROUP = 'group',
    CODE = 'code',
}

@Entity()
export class Codes extends BaseEntity {
    @PrimaryGeneratedColumn()
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
