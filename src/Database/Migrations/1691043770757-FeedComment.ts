import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class FeedComment1691043770757 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'feed_comment',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'feed_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'content',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['Y', 'N'],
                        enumName: 'statusEnum',
                        default: '"Y"',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        )

        await queryRunner.createForeignKey(
            'feed_comment',
            new TableForeignKey({
                columnNames: ['feed_id'],
                referencedTableName: 'feed',
                referencedColumnNames: ['id'],
                onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'feed_comment',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('feed_comment')
        if (table) {
            await queryRunner.dropTable('feed_comment')
        }
    }
}
