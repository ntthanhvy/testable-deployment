import { MigrationInterface, QueryRunner } from "typeorm";

class productVarImage1703306325050 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			'ALTER TABLE "product_variant" ADD COLUMN "image_upload" boolean DEFAULT false'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant" ADD COLUMN "meta_keywords" text'
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			'ALTER TABLE "product_variant" DROP COLUMN "meta_keywords"'
		);
		await queryRunner.query(
			'ALTER TABLE "product_variant" DROP COLUMN "image_upload"'
		);
	}
}

export default productVarImage1703306325050;
