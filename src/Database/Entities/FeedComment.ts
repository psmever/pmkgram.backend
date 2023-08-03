import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToOne } from 'typeorm'
import { Feed } from '@Entity/Feed'
import { Users } from '@Entity/Users'

@Entity()
export class FeedComment extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', nullable: false })
    feed_id: number

    @Column({ type: 'int', nullable: false })
    user_id: number

    @Column({ type: `text`, nullable: false })
    comment: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @OneToOne(() => Users, (u) => u.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users

    @ManyToOne(() => Feed, (feed) => feed.comment)
    @JoinColumn({ name: 'feed_id', referencedColumnName: 'id' })
    feed: Feed
}
