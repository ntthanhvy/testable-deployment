import { MigrationInterface, QueryRunner } from "typeorm";

class productCustom1701189607903 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "product_variant"' + ' ADD COLUMN "size" text'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant"' + ' ADD COLUMN "shape" text'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant"' + ' ADD COLUMN "nutritic_code" text'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant"' + ' ADD COLUMN "meta_title" text'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant"' + ' ADD COLUMN "meta_description" text'
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE "product_variant" DROP COLUMN "meta_description"'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant" DROP COLUMN "meta_title"'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant" DROP COLUMN "nutritic_code"'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant" DROP COLUMN "shape"'
		);
		await queryRunner.query('ALTER TABLE "product_variant" DROP COLUMN "size"');
	}
}

export default productCustom1701189607903;
