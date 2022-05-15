import { BAD_REQUEST } from '../../consts';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

import { createNoticeRequestValidator, noticeUpdateRequestValidator } from './notice';

describe('notice validators', () => {
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

  describe('createNoticeRequestValidator', () => {
    it('next function should call validation error when input is invalid', async () => {
      const invalidRequest = {
        params: {},
      };

      await createNoticeRequestValidator(invalidRequest as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
    });

    it('next function should call nothing when validation passed', async () => {
      const validRequest = {
        params: { id: 'id' },
      };

      await createNoticeRequestValidator(validRequest as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenCalled();
      expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('noticeUpdateRequestValidator', () => {
    it('next function should call validation error when input is invalid', async () => {
      const invalidRequest = {
        params: {},
      };

      const invalidRequest2 = {
        params: { id: 'id' },
      };

      const invalidRequest3 = {
        params: { nid: 'nid' },
      };

      await noticeUpdateRequestValidator(invalidRequest as any, {} as any, spyNext);
      await noticeUpdateRequestValidator(invalidRequest2 as any, {} as any, spyNext);
      await noticeUpdateRequestValidator(invalidRequest3 as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
      expect(spyNext).toHaveBeenNthCalledWith(3, validationError);
    });

    it('next function should call nothing when validation passed', async () => {
      const validRequest = {
        params: { id: 'id', nid: 'nid' },
      };

      await noticeUpdateRequestValidator(validRequest as any, {} as any, spyNext);

      expect(spyNext).toHaveBeenCalled();
      expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
    });
  });
});
