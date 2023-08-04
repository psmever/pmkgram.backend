import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn } from 'typeorm'
import { Users } from '@Entity/Users'
import { FeedComment } from '@Entity/FeedComment'
import { FeedImage } from '@Entity/FeedImage'
import { FeedGreat } from '@Entity/FeedGreat'

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

    @OneToMany(() => FeedComment, (fc) => fc.feed, { cascade: true })
    comment?: FeedComment[]

    @OneToMany(() => FeedImage, (fc) => fc.feed, { cascade: true })
    images?: FeedImage[]

    @OneToMany(() => FeedGreat, (fg) => fg.feed, { cascade: true })
    great?: FeedGreat[]
}
