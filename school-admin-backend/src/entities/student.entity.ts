import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { StudentClass } from './student-class.entity';
import { Attendance } from './attendance.entity';
import { Grade } from './grade.entity';
import { AssignmentSubmission } from './assignment-submission.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  studentId: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  parentName: string;

  @Column({ nullable: true })
  parentEmail: string;

  @Column({ nullable: true })
  parentPhone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  enrollmentDate: Date;

  @Column({ nullable: true })
  currentGrade: string;

  @OneToMany(() => StudentClass, (studentClass) => studentClass.student)
  enrolledClasses: StudentClass[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[];

  @OneToMany(() => AssignmentSubmission, (submission) => submission.student)
  submissions: AssignmentSubmission[];
}
