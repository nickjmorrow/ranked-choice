import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity({ name: 'polls' })
export class Poll {
  @PrimaryGeneratedColumn({ name: 'poll_id' })
  pollId: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string | null;

  /** The public, unguessable id in every URL. `pollId` never leaves the API. */
  @Column({ name: 'link', type: 'varchar' })
  link: string;

  @OneToMany(() => Question, (question) => question.poll)
  questions: Question[];
}
