import { MigrationInterface, QueryRunner } from 'typeorm'

export class FeedAddColumnStatus1690009991851 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE feed ADD status enum('Y','N') default 'Y' AFTER content`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE feed DROP COLUMN status`) // reverts things made in "up" method
    }
}
