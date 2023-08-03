import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToOne } from 'typeorm'
import { Feed } from '@Entity/Feed'
import { Media } from '@Entity/Media'

@Entity()
export class FeedImage extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', nullable: false })
    feed_id: number

    @Column({ type: 'int', nullable: false })
    feed_image_id: number

    @ManyToOne(() => Feed, (feed) => feed.images)
    @JoinColumn({ name: 'feed_id', referencedColumnName: 'id' })
    feed?: Feed

    @OneToOne(() => Media, (m) => m.feedimage, { cascade: true })
    media?: Media
}
