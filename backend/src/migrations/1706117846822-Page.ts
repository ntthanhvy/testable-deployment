import { MigrationInterface, QueryRunner } from "typeorm";

class page1706117846822 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "page" (
				"id" character varying NOT NULL, 
				"created_at" TIMESTAMP NOT NULL DEFAULT now(), 
				"updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
				"deleted_at" TIMESTAMP, "title" character varying NOT NULL, 
				"slug" character varying NOT NULL, 
				"body" text NOT NULL, 
				"parent_id" character varying, 
				"status" INT NOT NULL DEFAULT 0,
				CONSTRAINT "PK_0b9024d21c9353d6517fbc1f0cf" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_page_slug" ON "page" ("slug") `
		);

		await queryRunner.query(
			`ALTER TABLE "page" ADD CONSTRAINT "FK_page_parent_id" FOREIGN KEY ("parent_id") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "page" DROP CONSTRAINT "FK_page_parent_id"`
		);
		await queryRunner.query(`DROP INDEX "IDX_page_slug"`);

		await queryRunner.query(`DROP TABLE "page"`);
	}
}

export default page1706117846822;
