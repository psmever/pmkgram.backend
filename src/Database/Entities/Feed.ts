import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinTable, OneToMany, JoinColumn } from 'typeorm'
import { Users } from '@Entity/Users'
import { FeedComment } from '@Entity/FeedComment'

@Entity()
export class Feed extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', nullable: false })
    user_id: number

    @Column({ type: 'text', nullable: false })
    content: string

    @Column({ type: `char`, nullable: false, length: 6 })
    status: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string

    @OneToOne(() => Users, (u) => u.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users

    @OneToMany(() => FeedComment, (fc) => fc.feed_id, { eager: true, cascade: true })
    @JoinTable({ name: 'id' })
    comment?: FeedComment[]
}
