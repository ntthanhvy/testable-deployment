import { MigrationInterface, QueryRunner } from "typeorm";

class store1706682112483 implements MigrationInterface {
	public async up(queryRunner: QueryRunner) {
		await queryRunner.query(
			`ALTER TABLE "store" ADD "banner_image" character varying NOT NULL DEFAULT ''`
		);
		await queryRunner.query(
			`ALTER TABLE "store" ADD "favicon" character varying NOT NULL DEFAULT ''`
		);
		await queryRunner.query(
			`ALTER TABLE "store" ADD "logo" character varying NOT NULL DEFAULT ''`
		);
		await queryRunner.query(
			`ALTER TABLE "store" ADD "site_name" character varying NOT NULL DEFAULT ''`
		);
	}

	public async down(queryRunner: QueryRunner) {
		await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "banner_image"`);
		await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "favicon"`);
		await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "logo"`);
		await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "site_name"`);
	}
}

export default store1706682112483;
