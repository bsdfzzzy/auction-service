import { PaymentResponse } from './payment';

describe('payment model', () => {
  describe('PaymentResponse', () => {
    it('should return true when status is 200', () => {
      const paymentResponse = new PaymentResponse(200);

      expect(paymentResponse.isSuccessed()).toBeTruthy();
    });

    it('should return true when status is 201', () => {
      const paymentResponse = new PaymentResponse(201);

      expect(paymentResponse.isSuccessed()).toBeTruthy();
    });

    it('should return true when status is not 200 or 201', () => {
      const paymentResponse = new PaymentResponse(400);

      expect(paymentResponse.isSuccessed()).toBeFalsy();
    });
  });
});
