import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, OneToOne } from 'typeorm'
import { FeedImage } from '@Entity/FeedImage'

@Entity()
export class Media extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: `int`, nullable: false })
    user_id: number

    @Column({ type: `char`, nullable: false, length: 6 })
    type: string

    @Column({ type: `varchar`, nullable: false, length: 255 })
    path: string

    @Column({ type: `varchar`, nullable: false, length: 255 })
    filename: string

    @Column({ type: `varchar`, nullable: false, length: 255 })
    origin_name: string

    @Column({ type: `int`, nullable: false })
    size: number

    @Column({ type: `timestamp`, nullable: false })
    created_at: Date

    @OneToOne(() => FeedImage, (fi) => fi.media)
    @JoinColumn({ name: 'id', referencedColumnName: 'feed_image_id' })
    feedimage: FeedImage
}
