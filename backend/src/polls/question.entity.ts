import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from './option.entity';
import { Poll } from './poll.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn({ name: 'question_id' })
  questionId: number;

  @Column({ name: 'poll_id', type: 'int' })
  pollId: number;

  /** Position within the poll, from 1. */
  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @Column({ name: 'content', type: 'varchar' })
  content: string;

  @Column({ name: 'subheading', type: 'varchar', nullable: true })
  subheading: string | null;

  /** Whether a ballot must rank at least one option for this question. */
  @Column({ name: 'is_required', type: 'boolean' })
  isRequired: boolean;

  @ManyToOne(() => Poll, (poll) => poll.questions)
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
}
