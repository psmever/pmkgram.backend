import { MigrationInterface, QueryRunner } from 'typeorm'

export class FeedCommentRenameColumnContent1691071136312 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('alter table feed_comment change content comment text')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('alter table feed_comment change comment content text')
    }
}
