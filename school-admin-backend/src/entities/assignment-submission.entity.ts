import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { Student } from './student.entity';
import { SubmissionStatus } from '../common/enums';

@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  @JoinColumn()
  assignment: Assignment;

  @ManyToOne(() => Student, (student) => student.submissions)
  @JoinColumn()
  student: Student;

  @CreateDateColumn()
  submissionDate: Date;

  @Column('simple-array', { nullable: true })
  attachments: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  marksObtained: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;
}
