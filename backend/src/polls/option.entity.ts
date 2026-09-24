import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity({ name: 'options' })
export class Option {
  @PrimaryGeneratedColumn({ name: 'option_id' })
  optionId: number;

  @Column({ name: 'question_id', type: 'int' })
  questionId: number;

  @Column({ name: 'label', type: 'varchar' })
  label: string;

  @Column({ name: 'sublabel', type: 'varchar', nullable: true })
  sublabel: string | null;

  @ManyToOne(() => Question, (question) => question.options)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
