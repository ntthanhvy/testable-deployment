import { query } from "express";
import { MigrationInterface, QueryRunner } from "typeorm";

class storeManagement1703432612359 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "store_location" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "code" character varying NOT NULL, "address_id" character varying NOT NULL, "addressId" character varying, CONSTRAINT "PK_store_id" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "store_location" ADD CONSTRAINT "FK_store_address_key" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_store_location_code" ON "store_location" ("code")`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "store_location" DROP CONSTRAINT "FK_store_address_key"`
		);
		await queryRunner.query(`DROP INDEX "IDX_store_location_code"`);
		await queryRunner.query(`DROP TABLE "store_location"`);
	}
}

export default storeManagement1703432612359;
