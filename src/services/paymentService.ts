import { NextFunction, Request, Response } from 'express';

import { getPayment, payment } from '../adapters/paymentAdapter';
import { createPaymentEvidence, getPaymentEvidence, updatePaymentEvidence } from '../repositories/paymentRepository';

import { getGoodInfo } from './goodService';
import { calculatePrice } from './priceCalculator';

export const finalPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { amount } = req.body;

  const good = await getGoodInfo(id);
  const calculatedAmount = calculatePrice(good);

  if (amount !== calculatedAmount) {
    res.status(400).send();
    return next();
  }

  const paymentEvidence = await createPaymentEvidence({
    good_id: good.id,
    amount: calculatedAmount,
    status: 'WAITING_FOR_PAYMENT',
  });

  const response = await payment(paymentEvidence.id, calculatedAmount);

  if (response.isSuccessed()) {
    res.status(201).send({ paymentId: paymentEvidence.id });
  } else {
    res.status(500).send({ paymentId: paymentEvidence.id });
  }
};

export const finalPaymentConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { fid } = req.params;
  const { updateAt } = req.body;

  const paymentEvidence = await getPaymentEvidence(fid);
  await updatePaymentEvidence({
    ...paymentEvidence,
    status: 'PAID',
    updated_at: updateAt,
  });

  res.status(200).send();
};

export const getFinalPaymentEvidence = async (req: Request, res: Response, next: NextFunction) => {
  const { fid } = req.params;

  const paymentEvidence = await getPaymentEvidence(fid);

  if (paymentEvidence.status === 'WAIT_FOR_PAYMENT') {
    const paymentResult = await getPayment(paymentEvidence.id);
    const updatedPaymentEvidence = await updatePaymentEvidence({
      ...paymentEvidence,
      status: paymentResult.status,
    });

    res.status(200).send({
      paymentEvidence: updatedPaymentEvidence,
    });
    next();
  }

  res.status(200).send({
    paymentEvidence,
  });
};
