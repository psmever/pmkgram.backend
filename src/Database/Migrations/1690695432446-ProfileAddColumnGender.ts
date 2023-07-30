import { MigrationInterface, QueryRunner } from 'typeorm'

export class ProfileAddColumnGender1690695432446 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE profile ADD gender char(6) null AFTER profile_image_id`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE profile DROP COLUMN gender`) // reverts things made in "up" method
    }
}
