import { mocked } from 'ts-jest/utils';

import { payment } from '../adapters/paymentAdapter';
import { PaymentResponse } from '../models/payment';
import { createPaymentEvidence } from '../repositories/paymentRepository';

import { getGoodInfo } from './GoodService';
import { finalPayment } from './PaymentService';
import { calculatePrice } from './PriceCalculator';

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
  it('should return 201 when every this works fine', async () => {
    mocked(getGoodInfo).mockResolvedValue(good);
    mocked(calculatePrice).mockReturnValue(9000);
    mocked(createPaymentEvidence).mockResolvedValue({
      id: 'uuid',
      good_id: 'goodId',
      amount: 1000,
      status: 'WAITING_FOR_PAYMENT',
    });
    mocked(PaymentResponse).mockReturnValue({
      isSuccessed: () => true,
    } as any);
    mocked(payment).mockResolvedValue(new PaymentResponse(Number()));

    const spyResStatus = jest.fn();
    const spyResSend = jest.fn();

    const spyReq: any = { params: {} };
    const spyRes: any = {
      status: spyResStatus.mockReturnValue({ send: spyResSend }),
    };
    const spyNext = jest.fn();

    await finalPayment(spyReq, spyRes, spyNext);

    expect(spyResStatus).toHaveBeenCalledWith(201);
    expect(spyResSend).toHaveBeenCalled();
  });
});
