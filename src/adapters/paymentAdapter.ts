import axios from 'axios';

import { PaymentResponse, PaymentResultResponse } from '../models/payment';

// export const payment = async (id, amount): Promise<PaymentResponse> => {
//   const response = await send({ id, amount });
//   return new PaymentResponse(response.status);
// };

export const payment = async (id, amount): Promise<PaymentResponse> => {
  const response = await axios.post('payment-gateway.url/payment', { id, amount });
  return new PaymentResponse(response.status);
};

export const getPayment = async (id: string): Promise<PaymentResultResponse> => {
  const response = await axios.get<PaymentResultResponse>(`payment-gateway.url/payment/${id}`);
  return response.data;
};
