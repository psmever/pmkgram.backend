import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm'
import { Users } from './Users'
import { Media } from './Media'
import { Codes } from './Codes'

@Entity()
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', nullable: false })
    user_id: number

    @Column({ type: 'int', nullable: false })
    profile_image_id: number

    @Column({ type: 'char', nullable: false, length: 6 })
    gender: string

    @Column({ type: 'char', nullable: true, length: 255 })
    intro: string | null

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @OneToOne(() => Users, (u) => u.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users

    @OneToOne(() => Media, (m) => m.id, { cascade: true })
    @JoinColumn({ name: `profile_image_id` })
    media?: Media

    @OneToOne(() => Codes, (c) => c.code_id, { cascade: true })
    @JoinColumn({ name: 'gender', referencedColumnName: 'code_id' })
    code?: Codes
}
