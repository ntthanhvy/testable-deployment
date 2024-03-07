import { MigrationInterface, QueryRunner } from "typeorm";

class productCustom1701857014685 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "product_variant"' + ' ADD COLUMN "character_limit" int'
		);
		await queryRunner.query(
			'ALTER TABLE "product"' +
				' ADD COLUMN "personalized_message" boolean DEFAULT false'
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "product" DROP COLUMN "personalized_message"'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant" DROP COLUMN "character_limit"'
		);
	}
}

export default productCustom1701857014685;
