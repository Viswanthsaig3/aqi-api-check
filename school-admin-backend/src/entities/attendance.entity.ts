import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';
import { Teacher } from './teacher.entity';
import { AttendanceStatus } from '../common/enums';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.attendances)
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.attendances)
  @JoinColumn()
  class: Class;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
  })
  status: AttendanceStatus;

  @ManyToOne(() => Teacher)
  @JoinColumn()
  markedBy: Teacher;

  @Column({ nullable: true })
  remarks: string;
}
