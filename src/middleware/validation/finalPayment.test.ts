import { BAD_REQUEST } from '../../consts';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

import { finalPaymentRequestValidator } from './finalPayment';

describe('validatorBooking', () => {
  const validationError = new CustomError(
    BAD_REQUEST,
    ErrorType.Validation,
    'Request params validation failed',
    null,
    null,
  );
  let spyNext: jest.Mock;
  beforeEach(() => {
    spyNext = jest.fn();
  });

  it('next function should call validation error when input is invalid', async () => {
    const invalidRequest = {
      params: {},
      body: {},
    };

    const invalidRequest2 = {
      params: { id: 'id' },
      body: {},
    };

    const invalidRequest3 = {
      params: {},
      body: { amount: 9000 },
    };

    await finalPaymentRequestValidator(invalidRequest as any, {} as any, spyNext);
    await finalPaymentRequestValidator(invalidRequest2 as any, {} as any, spyNext);
    await finalPaymentRequestValidator(invalidRequest3 as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(3, validationError);
  });

  it('next function should call nothing when validation passed', async () => {
    const validRequest = {
      params: { id: 'id' },
      body: { amount: 9000 },
    };

    await finalPaymentRequestValidator(validRequest as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
  });
});
