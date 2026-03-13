import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateForeignKeys1773248199149 implements MigrationInterface {
    name = 'UpdateForeignKeys1773248199149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3"`);
        await queryRunner.query(`ALTER TABLE "epr_records" DROP CONSTRAINT "FK_c158ce99618a530733fefa4db52"`);
        await queryRunner.query(`ALTER TABLE "epr_records" DROP CONSTRAINT "FK_679d51042550140d00b9a5ac3c9"`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "epr_records" ADD CONSTRAINT "FK_c158ce99618a530733fefa4db52" FOREIGN KEY ("person_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "epr_records" ADD CONSTRAINT "FK_679d51042550140d00b9a5ac3c9" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "epr_records" DROP CONSTRAINT "FK_679d51042550140d00b9a5ac3c9"`);
        await queryRunner.query(`ALTER TABLE "epr_records" DROP CONSTRAINT "FK_c158ce99618a530733fefa4db52"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c"`);
        await queryRunner.query(`ALTER TABLE "epr_records" ADD CONSTRAINT "FK_679d51042550140d00b9a5ac3c9" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "epr_records" ADD CONSTRAINT "FK_c158ce99618a530733fefa4db52" FOREIGN KEY ("person_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
