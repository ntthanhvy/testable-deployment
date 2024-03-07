import { MigrationInterface, QueryRunner } from "typeorm";

class page1706281356153 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "page" ADD "order" integer NOT NULL DEFAULT '0'`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "page" DROP COLUMN "order"`);
	}
}

export default page1706281356153;
