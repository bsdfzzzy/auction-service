import { NextFunction, Request, Response } from 'express';

import { payment } from '../adapters/paymentAdapter';
import { createPaymentEvidence, getPaymentEvidence, updatePaymentEvidence } from '../repositories/paymentRepository';

import { getGoodInfo } from './goodService';
import { calculatePrice } from './priceCalculator';

export const finalPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const good = await getGoodInfo(id);
  const amount = calculatePrice(good);

  const paymentEvidence = await createPaymentEvidence({
    good_id: good.id,
    amount,
    status: 'WAITING_FOR_PAYMENT',
  });

  const response = await payment(paymentEvidence.id, amount);

  if (response.isSuccessed()) {
    res.status(201).send();
  }
};

export const finalPaymentConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { id, fid } = req.params;

  const paymentEvidence = await getPaymentEvidence(fid);
  await updatePaymentEvidence(fid, {
    ...paymentEvidence,
    status: 'PAID',
    updated_at: new Date(),
  });

  res.status(200).send();
};