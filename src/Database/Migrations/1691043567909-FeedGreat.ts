import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class FeedGreat1691043567909 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'feed_great',
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
            'feed_great',
            new TableForeignKey({
                columnNames: ['feed_id'],
                referencedTableName: 'feed',
                referencedColumnNames: ['id'],
                onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'feed_great',
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
        const table = await queryRunner.getTable('feed_great')
        if (table) {
            await queryRunner.dropTable('feed_great')
        }
    }
}
