import { Request, Response, NextFunction } from 'express';

import { BAD_REQUEST } from '../../consts';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

export const finalPaymentRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!id || !amount) {
    const validationError = new CustomError(
      BAD_REQUEST,
      ErrorType.Validation,
      'Request params validation failed',
      null,
      null,
    );
    return next(validationError);
  }

  return next();
};
