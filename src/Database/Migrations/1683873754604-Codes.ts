import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Codes1683873754604 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'codes',
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
                        type: 'enum',
                        enum: ['group', 'code'],
                        isNullable: false,
                    },
                    {
                        name: 'group_id',
                        type: 'varchar',
                        length: '3',
                    },
                    {
                        name: 'code_id',
                        type: 'varchar',
                        length: '6',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('codes')
        if (table) {
            await queryRunner.dropTable('codes')
        }
    }
}
