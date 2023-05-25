import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class Media1685025318263 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'media',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'type',
                        type: 'char',
                        length: '6',
                        isNullable: true,
                    },
                    {
                        name: 'path',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'filename',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'origin_name',
                        type: 'enum',
                        enum: ['Y', 'N'],
                        enumName: 'statusEnum',
                        default: '"Y"',
                        isNullable: false,
                    },
                    {
                        name: 'size',
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
            true,
        )

        await queryRunner.createIndex(
            'media',
            new TableIndex({
                name: 'IDX_MEDIA_PATH_FILENAME',
                columnNames: ['path', 'filename'],
                isUnique: true,
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('media')
        if (table) {
            await queryRunner.dropTable('media')
        }
    }
}
