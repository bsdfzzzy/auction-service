import { PaymentResponse } from '../models/payment';
import { send } from '../utils/paymentQueue';

export const payment = async (id, amount): Promise<PaymentResponse> => {
  const response = await send({ id, amount });
  return new PaymentResponse(response.status);
};
