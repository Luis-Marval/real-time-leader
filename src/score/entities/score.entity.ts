import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/users';
import { Game } from '../../game/entities/game';

@Entity({ name: 'score', schema: 'public' })
export class Score {
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @Column({ type: 'int4', name: 'userId' })
  userId: number;

  @Column({ type: 'int4', name: 'gameId' })
  gameId: number;

  @Column({ type: 'int4', name: 'point' })
  point: number;

  @Column({
    type: 'timestamp',
    name: 'create_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_date: Date;

  @ManyToOne(() => User, (user) => user.scores)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Game, (game) => game.scores)
  @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
  game: Game;
}
