import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeUserFromPoll1594494665716 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			ALTER TABLE public.polls
			DROP COLUMN user_id;
		`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			ALTER TABLE public.polls
			ADD user_id INT NOT NULL REFERENCES public.users(user_id);
		`);
    }
}
