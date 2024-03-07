import { MigrationInterface, QueryRunner } from "typeorm";

class productCollection1703212091002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product_collection"' + ' ADD COLUMN "thumbnail" text'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product_collection" DROP COLUMN "thumbnail"'
    );
  }
}

export default productCollection1703212091002;