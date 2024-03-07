import { MigrationInterface, QueryRunner } from "typeorm";

class cartCustom1703212142767 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			'ALTER TABLE "line_item"' + ' ADD COLUMN "personal_message" text'
		);
		await queryRunner.query(
			'ALTER TABLE "line_item"' + ' ADD COLUMN "image" text'
		);

		// cart
		await queryRunner.query(
			'ALTER TABLE "cart"' + ' ADD COLUMN "deliver_at" TIMESTAMP WITH TIME ZONE'
		);
		await queryRunner.query(
			'CREATE INDEX "idx_cart_deliver_at" ON "cart" ("deliver_at")'
		);

		// order
		await queryRunner.query(
			'ALTER TABLE "order"' +
				' ADD COLUMN "deliver_at" TIMESTAMP WITH TIME ZONE'
		);
		await queryRunner.query(
			'CREATE INDEX "idx_order_deliver_at" ON "order" ("deliver_at")'
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// order
		await queryRunner.query('DROP INDEX "idx_order_deliver_at"');
		await queryRunner.query('ALTER TABLE "order" DROP COLUMN "deliver_at"');

		// cart
		await queryRunner.query('DROP INDEX "idx_cart_deliver_at"');
		await queryRunner.query('ALTER TABLE "cart" DROP COLUMN "deliver_at"');

		await queryRunner.query('ALTER TABLE "line_item" DROP COLUMN "image"');
		await queryRunner.query(
			'ALTER TABLE "line_item" DROP COLUMN "personal_message"'
		);
	}
}

export default cartCustom1703212142767;
