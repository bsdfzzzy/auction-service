import { BAD_REQUEST } from '../../consts';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

import {
  finalPaymentConfirmationRequestValidator,
  finalPaymentRequestValidator,
  getFinalPaymentEvidenceRequestValidator,
} from './finalPayment';

describe('finalPayment validators', () => {
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

  describe('finalPaymentRequestValidator', () => {
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

  describe('finalPaymentConfirmationRequestValidator', () => {
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
        params: { id: 'id', fid: 'fid' },
        body: {},
      };

      const invalidRequest4 = {
        params: {},
        body: { amount: 9000 },
      };

      const invalidRequest5 = {
        params: { id: 'id' },
        body: { amount: 9000 },
      };

      const invalidRequest6 = {
        params: { fid: 'fid' },
        body: { amount: 9000 },
      };

      await finalPaymentConfirmationRequestValidator(invalidRequest as any, {} as any, spyNext);
      await finalPaymentConfirmationRequestValidator(invalidRequest2 as any, {} as any, spyNext);
      await finalPaymentConfirmationRequestValidator(invalidRequest3 as any, {} as any, spyNext);
      await finalPaymentConfirmationRequestValidator(invalidRequest4 as any, {} as any, spyNext);
      await finalPaymentConfirmationRequestValidator(invalidRequest5 as any, {} as any, spyNext);
      await finalPaymentConfirmationRequestValidator(invalidRequest6 as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(3, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(4, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(5, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(6, validationError);
    });

    it('next function should call nothing when validation passed', async () => {
      const validRequest = {
        params: { id: 'id', fid: 'fid' },
        body: { amount: 9000 },
      };

      await finalPaymentRequestValidator(validRequest as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenCalled();
      expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('getFinalPaymentEvidenceRequestValidator', () => {
    it('next function should call validation error when input is invalid', async () => {
      const invalidRequest = {
        params: {},
      };

      const invalidRequest2 = {
        params: { id: 'id' },
      };

      const invalidRequest3 = {
        params: { fid: 'fid' },
      };

      await getFinalPaymentEvidenceRequestValidator(invalidRequest as any, {} as any, spyNext);
      await getFinalPaymentEvidenceRequestValidator(invalidRequest2 as any, {} as any, spyNext);
      await getFinalPaymentEvidenceRequestValidator(invalidRequest3 as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(3, validationError);
    });

    it('next function should call nothing when validation passed', async () => {
      const validRequest = {
        params: { id: 'id', fid: 'fid' },
      };

      await getFinalPaymentEvidenceRequestValidator(validRequest as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenCalled();
      expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
    });
  });
});
