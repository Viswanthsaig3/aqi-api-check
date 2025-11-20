import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';
import { Assignment } from './assignment.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  employeeId: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  qualification: string;

  @Column('simple-array', { nullable: true })
  subjects: string[];

  @Column({ type: 'date', nullable: true })
  joiningDate: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.teacher)
  classes: Class[];

  @OneToMany(() => Assignment, (assignment) => assignment.teacher)
  assignments: Assignment[];
}
