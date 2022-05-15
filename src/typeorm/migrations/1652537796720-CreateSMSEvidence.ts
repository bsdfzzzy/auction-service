import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSMSEvidence1652537796720 implements MigrationInterface {
  name = 'CreateOrders1640444887910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sms_evidence" ("id" SERIAL NOT NULL, "good_id" character varying(100) NOT NULL, "user_id" character varying(100) NOT NULL, "is_owner" BOOLEAN NOT NULL,  "status" character varying(20), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sms_evidence"`, undefined);
  }
}
