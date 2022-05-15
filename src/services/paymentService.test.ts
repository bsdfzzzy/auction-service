import * as mockdate from 'mockdate';
import { mocked } from 'ts-jest/utils';

import { getPayment, payment } from '../adapters/paymentAdapter';
import { PaymentResponse } from '../models/payment';
import { createPaymentEvidence, getPaymentEvidence, updatePaymentEvidence } from '../repositories/paymentRepository';

import { getGoodInfo } from './GoodService';
import { finalPayment, finalPaymentConfirmation, getFinalPaymentEvidence } from './PaymentService';
import { calculatePrice } from './PriceCalculator';

mockdate.set('2022-01-01');

jest.mock('./goodService');
jest.mock('./priceCalculator');
jest.mock('../repositories/paymentRepository');
jest.mock('../adapters/paymentAdapter');
jest.mock('../models/payment');

const good = {
  id: '1',
  name: 'good1',
  totalPrice: 10000,
  securityDeposit: 1000,
  ownerId: 'ownerId',
};

describe('PaymentService', () => {
  const spyResStatus = jest.fn();
  const spyResSend = jest.fn();

  let spyReq: any;
  const spyRes: any = {
    status: spyResStatus.mockReturnValue({ send: spyResSend }),
  };
  const spyNext = jest.fn();

  describe('finalPayment', () => {
    it('should return 201 when final payment works fine', async () => {
      mocked(getGoodInfo).mockResolvedValue(good);
      mocked(calculatePrice).mockReturnValue(9000);
      mocked(createPaymentEvidence).mockResolvedValue({
        id: 'uuid',
        good_id: 'goodId',
        amount: 9000,
        status: 'WAITING_FOR_PAYMENT',
      });
      mocked(PaymentResponse).mockReturnValue({
        isSuccessed: () => true,
      } as any);
      mocked(payment).mockResolvedValue(new PaymentResponse(201));

      spyReq = { params: {}, body: { amount: 9000 } };

      await finalPayment(spyReq, spyRes, spyNext);

      expect(spyResStatus).toHaveBeenCalledWith(201);
      expect(spyResSend).toHaveBeenCalled();
    });

    it('should return 400 when calculated amount is 200 and given amount is 100', async () => {
      mocked(getGoodInfo).mockResolvedValue(good);
      mocked(calculatePrice).mockReturnValue(200);

      spyReq = { params: {}, body: { amount: 100 } };

      await finalPayment(spyReq, spyRes, spyNext);

      expect(spyResStatus).toHaveBeenCalledWith(400);
      expect(spyResSend).toHaveBeenCalled();
    });

    it('should return 400 when calculated amount is 200 and given amount is 300', async () => {
      mocked(getGoodInfo).mockResolvedValue(good);
      mocked(calculatePrice).mockReturnValue(200);

      spyReq = { params: {}, body: { amount: 300 } };

      await finalPayment(spyReq, spyRes, spyNext);

      expect(spyResStatus).toHaveBeenCalledWith(400);
      expect(spyResSend).toHaveBeenCalled();
      expect(spyNext).toHaveBeenCalled();
    });
  });

  describe('finalPaymentConfirmation', () => {
    it('should return 200 when final payment confirmation works fine', async () => {
      mocked(getPaymentEvidence).mockResolvedValue({
        id: 'uuid',
        good_id: 'goodId',
        amount: 1000,
        status: 'WAITING_FOR_PAYMENT',
      });
      spyReq = { params: { fid: 'fid' } };

      await finalPaymentConfirmation(spyReq, spyRes, spyNext);

      expect(updatePaymentEvidence).toHaveBeenCalledWith({
        id: 'uuid',
        good_id: 'goodId',
        amount: 1000,
        status: 'PAID',
        updated_at: new Date('2022-01-01'),
      });
      expect(spyResStatus).toHaveBeenCalledWith(200);
      expect(spyResSend).toHaveBeenCalled();
    });
  });

  describe('getFinalPaymentEvidence', () => {
    it('should return PAID payment evidence', async () => {
      const paymentEvidence = {
        id: 'uuid',
        good_id: 'goodId',
        amount: 1000,
        status: 'PAID',
      };
      mocked(getPaymentEvidence).mockResolvedValue(paymentEvidence);

      spyReq = { params: { fid: 'fid' } };

      await getFinalPaymentEvidence(spyReq, spyRes, spyNext);

      expect(spyResStatus).toHaveBeenCalledWith(200);
      expect(spyResSend).toHaveBeenCalledWith({ paymentEvidence });
    });

    it('should get payment result when payment evidence status is WAIT_FOR_PAYMENT', async () => {
      const paymentEvidence = {
        id: 'uuid',
        good_id: 'goodId',
        amount: 1000,
        status: 'WAIT_FOR_PAYMENT',
      };

      const updatedPaymentEvidence = {
        id: 'uuid',
        good_id: 'goodId',
        amount: 1000,
        status: 'PAID',
      };
      mocked(getPaymentEvidence).mockResolvedValue(paymentEvidence);
      mocked(getPayment).mockResolvedValue({ id: 'uuid', status: 'PAID', amount: 1000 });
      mocked(updatePaymentEvidence).mockResolvedValue(updatedPaymentEvidence);

      spyReq = { params: { fid: 'fid' } };

      await getFinalPaymentEvidence(spyReq, spyRes, spyNext);

      expect(getPayment).toHaveBeenCalledWith('uuid');
      expect(updatePaymentEvidence).toHaveBeenCalledWith(updatedPaymentEvidence);
      expect(spyResStatus).toHaveBeenCalledWith(200);
      expect(spyResSend).toHaveBeenCalledWith({ paymentEvidence: updatedPaymentEvidence });
    });
  });
});
