import { mocked } from 'ts-jest/utils';

import { PaymentResponse } from '../models/payment';
import { send } from '../utils/paymentQueue';

import { payment } from './paymentAdapter';

jest.mock('../utils/paymentQueue');

describe('PaymentAdapter', () => {
  it('should return correct PaymentResponse', async () => {
    mocked(send).mockResolvedValue({ status: 201 } as any);

    const result = await payment('id', 1000);

    expect(result.toString()).toEqual(new PaymentResponse(201).toString());
  });
});
