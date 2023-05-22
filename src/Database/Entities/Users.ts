import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinTable } from 'typeorm'
import { Codes } from './Codes'

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: `char`, nullable: false, length: 6 })
    type: string

    @Column({ type: `char`, nullable: false, length: 6 })
    level: string

    @Column({ type: `char`, nullable: false, length: 6 })
    status: string

    @Column({ type: `varchar`, nullable: false, length: 255 })
    email: string

    @Column({ type: `varchar`, nullable: false, length: 255 })
    password: string

    @Column({ type: `varchar`, nullable: false, length: 255 })
    nickname: string

    @Column({ type: `timestamp`, nullable: true })
    email_verified_at: string

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @OneToOne(() => Codes, (Code) => Code.code_id, { cascade: true })
    @JoinTable()
    statusCode?: Codes
}
