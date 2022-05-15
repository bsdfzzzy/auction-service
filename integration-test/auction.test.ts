import axios from 'axios';
import { getRepository, Connection, Repository } from 'typeorm';

import { dbCreateConnection } from '../src/typeorm/dbCreateConnection';
import { PaymentEvidence } from '../src/typeorm/entities/orders/PaymentEvidence';
import { SMSEvidence } from '../src/typeorm/entities/orders/SMSEvidence';

jest.setTimeout(20000);

jest.mock('axios');

const employeeInfo = {
  personName: 'personName',
  identificationNumber: '111111111111111111',
  mobilePhone: '13800000000',
};

describe('Orders API', () => {
  let dbConnection: Connection;
  let smsRepository: Repository<SMSEvidence>;
  let paymentRepository: Repository<PaymentEvidence>;

  let smsEvidence;
  let paymentEvidence;

  beforeAll(async () => {
    dbConnection = await dbCreateConnection();
    smsRepository = getRepository(SMSEvidence);
    paymentRepository = getRepository(PaymentEvidence);
  });

  afterAll(async () => {
    await smsRepository.delete(smsEvidence.id);
    await paymentRepository.delete(paymentEvidence.id);
  });

  it('should pass', () => {
    console.log('place holder');
  });
});
