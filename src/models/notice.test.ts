import { SMSResponse } from './notice';

describe('notice model', () => {
  describe('SMSResponse', () => {
    it('should return true when status is 200', () => {
      const paymentResponse = new SMSResponse(200);

      expect(paymentResponse.isSuccessed()).toBeTruthy();
    });

    it('should return true when status is 201', () => {
      const paymentResponse = new SMSResponse(201);

      expect(paymentResponse.isSuccessed()).toBeTruthy();
    });

    it('should return true when status is not 200 or 201', () => {
      const paymentResponse = new SMSResponse(400);

      expect(paymentResponse.isSuccessed()).toBeFalsy();
    });
  });
});
