import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Teacher } from './teacher.entity';
import { AssignmentSubmission } from './assignment-submission.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class, (classEntity) => classEntity.assignments)
  @JoinColumn()
  class: Class;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignments)
  @JoinColumn()
  teacher: Teacher;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalMarks: number;

  @Column('simple-array', { nullable: true })
  attachments: string[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => AssignmentSubmission, (submission) => submission.assignment)
  submissions: AssignmentSubmission[];
}
