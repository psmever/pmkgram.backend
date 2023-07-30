import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class ProfileAddColumnGender1690695432446 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE profile ADD gender char(6) null AFTER profile_image_id`)

        await queryRunner.createForeignKey(
            'profile',
            new TableForeignKey({
                name: 'FK_profile_gender_codes',
                columnNames: ['gender'],
                referencedTableName: 'codes',
                referencedColumnNames: ['code_id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('profile', 'FK_profile_gender_codes')

        await queryRunner.query(`ALTER TABLE profile DROP COLUMN gender`) // reverts things made in "up" method
    }
}
