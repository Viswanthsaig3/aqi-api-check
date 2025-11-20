import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';
import { EnrollmentStatus } from '../common/enums';

@Entity('student_classes')
export class StudentClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.enrolledClasses)
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.students)
  @JoinColumn()
  class: Class;

  @CreateDateColumn()
  enrollmentDate: Date;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;
}
