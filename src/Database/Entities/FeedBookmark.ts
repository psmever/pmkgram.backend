import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, ManyToOne, JoinColumn } from 'typeorm'
import { Feed } from '@Entity/Feed'
import { Users } from '@Entity/Users'

@Entity()
export class FeedBookmark extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', nullable: false })
    feed_id: number

    @Column({ type: 'int', nullable: false })
    user_id: number

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @ManyToOne(() => Feed, (f) => f.great)
    @JoinColumn({ name: 'feed_id', referencedColumnName: 'id' })
    feed?: Feed

    @OneToOne(() => Users, (f) => f.id, { cascade: true })
    user?: Users
}
