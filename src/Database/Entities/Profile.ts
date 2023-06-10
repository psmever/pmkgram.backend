import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinTable } from 'typeorm'
import { Users } from './Users'
import { Media } from './Media'

@Entity()
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', nullable: false })
    user_id: number

    @Column({ type: 'int', nullable: false })
    profile_image_id: number

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinTable({ name: 'user_id' })
    user: Users

    @OneToOne(() => Media, (media) => media.id, { cascade: true })
    @JoinTable({ name: 'profile_image_id' })
    profileImage: Media
}
