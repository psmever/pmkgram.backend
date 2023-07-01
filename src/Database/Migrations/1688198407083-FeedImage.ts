import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class FeedImage1688198407083 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'feed_image',
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
                        name: 'feed_image_id',
                        type: 'int',
                        isNullable: false,
                    },
                ],
            }),
        )
        await queryRunner.createForeignKey(
            'feed_image',
            new TableForeignKey({
                columnNames: ['feed_id'],
                referencedTableName: 'feed',
                referencedColumnNames: ['id'],
                onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        )
        await queryRunner.createForeignKey(
            'feed_image',
            new TableForeignKey({
                columnNames: ['feed_image_id'],
                referencedTableName: 'media',
                referencedColumnNames: ['id'],
                onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('feed_image')
        if (table) {
            await queryRunner.dropTable('feed_image')
        }
    }
}
