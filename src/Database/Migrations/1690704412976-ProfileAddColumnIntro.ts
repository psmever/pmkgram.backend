import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProfileAddColumnIntro1690704412976 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE profile ADD intro char(255) null AFTER gender`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE profile DROP COLUMN intro`) // reverts things made in "up" method
    }
}
