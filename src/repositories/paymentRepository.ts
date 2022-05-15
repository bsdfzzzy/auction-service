import { getRepository } from 'typeorm';

import { PaymentEvidence } from '../typeorm/entities/orders/PaymentEvidence';

export const paymentRepository = () => getRepository(PaymentEvidence);

export const createPaymentEvidence = async (paymentEvidence: PaymentEvidence): Promise<PaymentEvidence> => {
  const _paymentRepository = paymentRepository();
  const paymentEntity = await _paymentRepository.create(paymentEvidence);
  return _paymentRepository.save(paymentEntity);
};

export const getPaymentEvidence = async (id: string): Promise<PaymentEvidence> => {
  const _paymentRepository = paymentRepository();
  return _paymentRepository.findOne(id);
};

export const updatePaymentEvidence = async (id: string, paymentEvidence: PaymentEvidence): Promise<PaymentEvidence> => {
  const _paymentRepository = paymentRepository();
  return _paymentRepository.save(paymentEvidence);
};
