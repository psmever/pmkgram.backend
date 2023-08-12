import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class FeedBookmark1691821928463 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'feed_bookmark',
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
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        )
        await queryRunner.createForeignKey(
            'feed_bookmark',
            new TableForeignKey({
                columnNames: ['feed_id'],
                referencedTableName: 'feed',
                referencedColumnNames: ['id'],
                onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'feed_bookmark',
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
        const table = await queryRunner.getTable('feed_bookmark')
        if (table) {
            await queryRunner.dropTable('feed_bookmark')
        }
    }
}
