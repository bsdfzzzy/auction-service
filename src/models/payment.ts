export class PaymentResponse {
  status: number;

  constructor(status) {
    this.status = status;
  }

  isSuccessed = () => this.status === 201 || this.status === 200;
}

export type PaymentResultResponse = {
  id: string;
  status: string;
  amount: number;
};
