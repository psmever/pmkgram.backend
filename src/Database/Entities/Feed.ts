import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class Feed extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', nullable: false })
    user_id: number

    @Column({ type: 'text', nullable: false })
    content: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string
}
