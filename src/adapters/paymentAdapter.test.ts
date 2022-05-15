import axios from 'axios';
import { mocked } from 'ts-jest/utils';

import { PaymentResponse } from '../models/payment';

import { getPayment, payment } from './paymentAdapter';

jest.mock('axios');

describe('PaymentAdapter', () => {
  it('should return correct PaymentResponse', async () => {
    mocked(axios.post).mockResolvedValue({ status: 201 } as any);

    const result = await payment('id', 1000);

    expect(result.toString()).toEqual(new PaymentResponse(201).toString());
  });

  it('should return correct payment result', async () => {
    mocked(axios.get).mockResolvedValue({
      data: {
        id: 'uuid',
        status: 'PAID',
        amount: 1000,
      },
    });

    const result = await getPayment('uuid');

    expect(result).toEqual({
      id: 'uuid',
      status: 'PAID',
      amount: 1000,
    });
  });
});
