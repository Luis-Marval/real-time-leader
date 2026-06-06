import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { Score } from '../../score/entities/score.entity';

@Entity({ name: 'users', schema: 'public' })
@Unique('users_unique', ['correo'])
export class User {
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'char', length: 60, name: 'password' })
  password: string;

  @Column({ type: 'text', name: 'correo' })
  correo: string;

  @Column({ type: 'text', name: 'recoverd_token', nullable: true })
  recoverdToken: string | null;

  @Column({ type: 'timestamp', name: 'recoverd_time', nullable: true })
  recoverdTime: Date | null;

  @OneToMany(() => Score, (score) => score.user)
  scores: Score[];
}
