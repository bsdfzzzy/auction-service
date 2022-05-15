import { mocked } from 'ts-jest/utils';

import { SMSResponse } from '../models/notice';
import { send } from '../utils/queue';

import { sendSMS } from './SMSAdapter';

jest.mock('../utils/queue');

describe('SMSAdapter', () => {
  it('should return correct SMSResponse', async () => {
    mocked(send).mockResolvedValue({ status: 201 } as any);

    const result = await sendSMS({
      good_id: 'good_id',
      user_id: 'user_id',
      status: 'CREATED',
      is_owner: false,
    });

    expect(result.toString()).toEqual(new SMSResponse(201).toString());
  });
});
