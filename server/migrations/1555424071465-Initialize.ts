import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initialize1555424071465 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "bio" character varying, "image" character varying, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roles" text NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`)
    await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "body" character varying NOT NULL, "tagList" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "UQ_0ab85f4be07b22d79906671d72f" UNIQUE ("slug"), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`)
    await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, "articleId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`)
    await queryRunner.query(`CREATE TABLE "user_followers_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_980ff03f415077df184596dcf73" PRIMARY KEY ("userId_1", "userId_2"))`)
    await queryRunner.query(`CREATE INDEX "IDX_26312a1e34901011fc6f63545e" ON "user_followers_user" ("userId_1") `)
    await queryRunner.query(`CREATE INDEX "IDX_110f993e5e9213a7a44f172b26" ON "user_followers_user" ("userId_2") `)
    await queryRunner.query(`CREATE TABLE "user_favorited_articles_article" ("userId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_f778d046289e60bd7a50e36a3d7" PRIMARY KEY ("userId", "articleId"))`)
    await queryRunner.query(`CREATE INDEX "IDX_7743f807947bdade59a4c45ff6" ON "user_favorited_articles_article" ("userId") `)
    await queryRunner.query(`CREATE INDEX "IDX_e9381ce1af2db9c7f4d4707583" ON "user_favorited_articles_article" ("articleId") `)
    await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c20404221e5c125a581a0d90c0e" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_followers_user" ADD CONSTRAINT "FK_26312a1e34901011fc6f63545e2" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_followers_user" ADD CONSTRAINT "FK_110f993e5e9213a7a44f172b264" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_favorited_articles_article" ADD CONSTRAINT "FK_7743f807947bdade59a4c45ff60" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_favorited_articles_article" ADD CONSTRAINT "FK_e9381ce1af2db9c7f4d4707583b" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_favorited_articles_article" DROP CONSTRAINT "FK_e9381ce1af2db9c7f4d4707583b"`)
    await queryRunner.query(`ALTER TABLE "user_favorited_articles_article" DROP CONSTRAINT "FK_7743f807947bdade59a4c45ff60"`)
    await queryRunner.query(`ALTER TABLE "user_followers_user" DROP CONSTRAINT "FK_110f993e5e9213a7a44f172b264"`)
    await queryRunner.query(`ALTER TABLE "user_followers_user" DROP CONSTRAINT "FK_26312a1e34901011fc6f63545e2"`)
    await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c20404221e5c125a581a0d90c0e"`)
    await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`)
    await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`)
    await queryRunner.query(`DROP INDEX "IDX_e9381ce1af2db9c7f4d4707583"`)
    await queryRunner.query(`DROP INDEX "IDX_7743f807947bdade59a4c45ff6"`)
    await queryRunner.query(`DROP TABLE "user_favorited_articles_article"`)
    await queryRunner.query(`DROP INDEX "IDX_110f993e5e9213a7a44f172b26"`)
    await queryRunner.query(`DROP INDEX "IDX_26312a1e34901011fc6f63545e"`)
    await queryRunner.query(`DROP TABLE "user_followers_user"`)
    await queryRunner.query(`DROP TABLE "comment"`)
    await queryRunner.query(`DROP TABLE "article"`)
    await queryRunner.query(`DROP TABLE "user"`)
  }

}
