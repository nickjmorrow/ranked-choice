import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPollingTables1594335418721 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			CREATE TABLE public.users (
				user_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
				, name VARCHAR NOT NULL
				, email VARCHAR NOT NULL
				, hashed_password VARCHAR NULL
				, date_created DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
				, date_deleted DATE NULL
			);

			CREATE TABLE public.polls (
				poll_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
				, title VARCHAR(255) NOT NULL
				, description VARCHAR NULL
				, link VARCHAR NOT NULL
				, user_id INT NOT NULL REFERENCES public.users(user_id)
				, date_created DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
				, date_deleted DATE NULL
			);

			CREATE TABLE public.questions (
				question_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
				, poll_id INT NOT NULL REFERENCES public.polls(poll_id)
				, order_id INT NOT NULL UNIQUE
				, content VARCHAR(255) NOT NULL
				, subheading VARCHAR(255) NULL
				, is_required BOOLEAN NOT NULL DEFAULT TRUE
			);

			CREATE TABLE public.options (
				option_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
				, question_id INT NOT NULL REFERENCES public.questions(question_id)
				, label VARCHAR(255) NOT NULL
				, sublabel VARCHAR(255) NULL
			);
		`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			DROP TABLE public.options;
			DROP TABLE public.questions;
			DROP TABLE public.polls;
			DROP TABLE public.users;
		`);
    }
}
