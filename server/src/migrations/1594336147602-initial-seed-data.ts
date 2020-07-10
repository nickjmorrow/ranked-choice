import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialSeedData1594336147602 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			INSERT INTO public.users (
				user_id
				, name
				, email
				, hashed_password
			)
			OVERRIDING SYSTEM VALUE
			VALUES
			(1, 'Hermoine Granger', 'hermoine.granger@gmail.com', '')
			, (2, 'Harry Potter', 'harry.potter@gmail.com', '');

			INSERT INTO public.polls (
				poll_id
				, title
				, description
				, link
				, user_id
			)
			OVERRIDING SYSTEM VALUE
			VALUES 
			(1, 'Lynn County General Election', '', 'djklsdfh', 1);

			INSERT INTO public.questions (
				question_id
				, poll_id
				, order_id
				, CONTENT
				, subheading
			)
			OVERRIDING SYSTEM VALUE
			VALUES (1, 1, 1, 'Who should win the general election?', 'Select at most one.');

			INSERT INTO public.options (
				option_id
				, question_id
				, label
				, sublabel
			)
			OVERRIDING SYSTEM VALUE
			VALUES 
			(1, 1, 'Strawberry Woman', 'Fruit Party')
			, (2, 1, 'Artichoke Man', 'Vegetable Party');
		`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			TRUNCATE TABLE public.options
			, public.questions 
			, public.polls
			, public.users
			RESTART IDENTITY CASCADE;
		`);
    }
}
