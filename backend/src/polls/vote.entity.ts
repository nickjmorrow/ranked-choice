import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * One ranked option on one ballot. A ballot is every vote sharing a
 * `submissionId`, and within a question, `orderId` is the rank (1 = first).
 */
@Entity({ name: 'votes' })
export class Vote {
  @PrimaryGeneratedColumn({ name: 'vote_id' })
  voteId: number;

  @Column({ name: 'question_id', type: 'int' })
  questionId: number;

  @Column({ name: 'option_id', type: 'int' })
  optionId: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @Column({ name: 'submission_id', type: 'int' })
  submissionId: number;
}
