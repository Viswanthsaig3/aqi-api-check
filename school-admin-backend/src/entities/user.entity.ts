import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../common/enums';
import { Admin } from './admin.entity';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Admin, (admin) => admin.user, { cascade: true })
  admin: Admin;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { cascade: true })
  teacher: Teacher;

  @OneToOne(() => Student, (student) => student.user, { cascade: true })
  student: Student;
}
