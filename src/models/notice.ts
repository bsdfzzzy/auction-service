export class SMSResponse {
  status: number;

  constructor(status) {
    this.status = status;
  }

  isSuccessed = () => this.status === 201 || this.status === 200;
}
