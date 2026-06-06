import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Score } from '../../score/entities/score.entity';
@Entity({ name: 'game', schema: 'public' })
export class Game {
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'isdelete', type: 'bool', default: false })
  isDelete: boolean;

  @CreateDateColumn({ name: 'createat' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updateat' })
  updateAt: Date;

  @OneToMany(() => Score, (score) => score.game)
  scores: Score[];
}
