import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('paymentEvidence')
export class PaymentEvidence {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  good_id: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column()
  @CreateDateColumn()
  created_at?: Date;
}
