import { MigrationInterface, QueryRunner } from "typeorm";

class updateStore1704507420566 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "store_location" ADD COLUMN "email" text`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "store_location" DROP COLUMN "email"`);
	}
}

export default updateStore1704507420566;