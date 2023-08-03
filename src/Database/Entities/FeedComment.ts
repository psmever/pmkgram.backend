import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinTable } from 'typeorm'
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

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @OneToOne(() => Feed, (f) => f.id, { cascade: true })
    @JoinTable()
    feed?: Feed

    @OneToOne(() => Users, (u) => u.id, { cascade: true })
    @JoinTable({ name: `id` })
    user?: Users
}
