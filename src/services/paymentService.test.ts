import * as mockdate from 'mockdate';
import { mocked } from 'ts-jest/utils';

import { payment } from '../adapters/paymentAdapter';
import { PaymentResponse } from '../models/payment';
import { createPaymentEvidence, getPaymentEvidence, updatePaymentEvidence } from '../repositories/paymentRepository';

import { getGoodInfo } from './GoodService';
import { finalPayment, finalPaymentConfirmation } from './PaymentService';
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
};

describe('PaymentService', () => {
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
    mocked(payment).mockResolvedValue(new PaymentResponse(Number()));

    const spyResStatus = jest.fn();
    const spyResSend = jest.fn();

    const spyReq: any = { params: {}, body: { amount: 9000 } };
    const spyRes: any = {
      status: spyResStatus.mockReturnValue({ send: spyResSend }),
    };
    const spyNext = jest.fn();

    await finalPayment(spyReq, spyRes, spyNext);

    expect(spyResStatus).toHaveBeenCalledWith(201);
    expect(spyResSend).toHaveBeenCalled();
  });

  it('should return 200 when final payment confirmation works fine', async () => {
    mocked(getPaymentEvidence).mockResolvedValue({
      id: 'uuid',
      good_id: 'goodId',
      amount: 1000,
      status: 'WAITING_FOR_PAYMENT',
    });

    const spyResStatus = jest.fn();
    const spyResSend = jest.fn();

    const spyReq: any = { params: { fid: 'fid' } };
    const spyRes: any = {
      status: spyResStatus.mockReturnValue({ send: spyResSend }),
    };
    const spyNext = jest.fn();

    await finalPaymentConfirmation(spyReq, spyRes, spyNext);

    expect(updatePaymentEvidence).toHaveBeenCalledWith('fid', {
      id: 'uuid',
      good_id: 'goodId',
      amount: 1000,
      status: 'PAID',
      updated_at: new Date('2022-01-01'),
    });
    expect(spyResStatus).toHaveBeenCalledWith(200);
    expect(spyResSend).toHaveBeenCalled();
  });

  it('should return 400 when calculated amount is 200 and given amount is 100', async () => {
    mocked(getGoodInfo).mockResolvedValue(good);
    mocked(calculatePrice).mockReturnValue(200);

    const spyResStatus = jest.fn();
    const spyResSend = jest.fn();

    const spyReq: any = { params: {}, body: { amount: 100 } };
    const spyRes: any = {
      status: spyResStatus.mockReturnValue({ send: spyResSend }),
    };
    const spyNext = jest.fn();

    await finalPayment(spyReq, spyRes, spyNext);

    expect(spyResStatus).toHaveBeenCalledWith(400);
    expect(spyResSend).toHaveBeenCalled();
  });

  it('should return 400 when calculated amount is 200 and given amount is 300', async () => {
    mocked(getGoodInfo).mockResolvedValue(good);
    mocked(calculatePrice).mockReturnValue(200);

    const spyResStatus = jest.fn();
    const spyResSend = jest.fn();

    const spyReq: any = { params: {}, body: { amount: 300 } };
    const spyRes: any = {
      status: spyResStatus.mockReturnValue({ send: spyResSend }),
    };
    const spyNext = jest.fn();

    await finalPayment(spyReq, spyRes, spyNext);

    expect(spyResStatus).toHaveBeenCalledWith(400);
    expect(spyResSend).toHaveBeenCalled();
  });
});
