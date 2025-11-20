import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  position: string;
}
