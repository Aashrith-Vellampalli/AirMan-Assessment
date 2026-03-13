import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773247238543 implements MigrationInterface {
    name = 'Init1773247238543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('student', 'admin', 'instructor')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."epr_records_role_type_enum" AS ENUM('student', 'instructor')`);
        await queryRunner.query(`CREATE TYPE "public"."epr_records_status_enum" AS ENUM('draft', 'submitted', 'archived')`);
        await queryRunner.query(`CREATE TABLE "epr_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_type" "public"."epr_records_role_type_enum" NOT NULL, "period_start" TIMESTAMP NOT NULL, "period_end" TIMESTAMP NOT NULL, "overall_rating" integer NOT NULL, "technical_skills_rating" integer NOT NULL, "non_technical_skills_rating" integer NOT NULL, "remarks" text NOT NULL, "status" "public"."epr_records_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "person_id" uuid, "evaluator_id" uuid, CONSTRAINT "CHK_0c6e9a71f29239d348e6956fc5" CHECK ("non_technical_skills_rating" >= 1 AND "non_technical_skills_rating" <= 5), CONSTRAINT "CHK_5fb2e0a4d1cb43831aba46a2fb" CHECK ("technical_skills_rating" >= 1 AND "technical_skills_rating" <= 5), CONSTRAINT "CHK_db53acb658f6ec3d18bbf02abf" CHECK ("overall_rating" >= 1 AND "overall_rating" <= 5), CONSTRAINT "PK_3e43fdf0ce266643660c39141f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "license_type" character varying NOT NULL, "total_required_hours" integer NOT NULL, CONSTRAINT "UQ_6ba1a54849ae17832337a39d5e5" UNIQUE ("name"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."enrollments_status_enum" AS ENUM('active', 'completed', 'dropped')`);
        await queryRunner.query(`CREATE TABLE "enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."enrollments_status_enum" NOT NULL, "start_date" TIMESTAMP NOT NULL, "student_id" uuid, "course_id" uuid, CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "epr_records" ADD CONSTRAINT "FK_c158ce99618a530733fefa4db52" FOREIGN KEY ("person_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "epr_records" ADD CONSTRAINT "FK_679d51042550140d00b9a5ac3c9" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c"`);
        await queryRunner.query(`ALTER TABLE "epr_records" DROP CONSTRAINT "FK_679d51042550140d00b9a5ac3c9"`);
        await queryRunner.query(`ALTER TABLE "epr_records" DROP CONSTRAINT "FK_c158ce99618a530733fefa4db52"`);
        await queryRunner.query(`DROP TABLE "enrollments"`);
        await queryRunner.query(`DROP TYPE "public"."enrollments_status_enum"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "epr_records"`);
        await queryRunner.query(`DROP TYPE "public"."epr_records_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."epr_records_role_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
