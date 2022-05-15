import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('smsEvidence')
export class SMSEvidence {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  good_id: string;

  @Column()
  user_id: string;

  @Column()
  is_owner: boolean;

  @Column()
  status: string;

  @Column()
  @CreateDateColumn()
  created_at?: Date;

  @Column()
  @UpdateDateColumn()
  updated_at?: Date;
}
