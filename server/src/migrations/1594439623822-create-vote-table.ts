import { MigrationInterface, QueryRunner } from 'typeorm';

export class createVoteTable1594439623822 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			CREATE TABLE public.votes (
				vote_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
				, option_id INT NOT NULL REFERENCES public.options(option_id)
				, question_id INT NOT NULL REFERENCES public.questions(question_id)
				, order_id INT NOT NULL
				, submission_id INT NOT NULL
				, UNIQUE(question_id, order_id, submission_id)
				, UNIQUE(question_id, option_id, submission_id)
			);
		`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.votes;`);
    }
}
