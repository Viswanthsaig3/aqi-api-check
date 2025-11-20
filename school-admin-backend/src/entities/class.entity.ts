import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { StudentClass } from './student-class.entity';
import { Attendance } from './attendance.entity';
import { Assignment } from './assignment.entity';
import { Grade } from './grade.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  className: string;

  @Column()
  grade: string;

  @Column()
  section: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes)
  @JoinColumn()
  teacher: Teacher;

  @Column()
  academicYear: string;

  @Column({ type: 'jsonb', nullable: true })
  schedule: object;

  @Column({ default: 30 })
  maxStudents: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => StudentClass, (studentClass) => studentClass.class)
  students: StudentClass[];

  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendances: Attendance[];

  @OneToMany(() => Assignment, (assignment) => assignment.class)
  assignments: Assignment[];

  @OneToMany(() => Grade, (grade) => grade.class)
  grades: Grade[];
}
