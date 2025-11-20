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
import { ExamType } from '../common/enums';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.grades)
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.grades)
  @JoinColumn()
  class: Class;

  @Column({
    type: 'enum',
    enum: ExamType,
  })
  examType: ExamType;

  @Column()
  subject: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  marksObtained: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalMarks: number;

  @Column({ length: 2 })
  grade: string;

  @Column()
  semester: string;

  @Column()
  academicYear: string;

  @ManyToOne(() => Teacher)
  @JoinColumn()
  gradedBy: Teacher;

  @Column({ nullable: true })
  remarks: string;
}
