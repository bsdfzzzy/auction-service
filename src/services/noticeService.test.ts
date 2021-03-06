import mockdate from 'mockdate';
import { mocked } from 'ts-jest/utils';

import { sendSMS } from '../adapters/smsAdapter';
import { SMSResponse } from '../models/notice';
import { createSMSEvidence, getSMSEvidence, updateSMSEvidence } from '../repositories/smsRepository';

import { getGoodInfo } from './goodService';
import { createNotice, updateNotice } from './noticeService';
import { getUserInfo } from './userService';

mockdate.set('2022-01-01');

jest.mock('./goodService');
jest.mock('./userService');
jest.mock('../repositories/smsRepository');
jest.mock('../adapters/smsAdapter');
jest.mock('../models/notice');

const good = {
  id: '1',
  name: 'good1',
  totalPrice: 10000,
  securityDeposit: 1000,
  ownerId: 'ownerId',
};

const userInfo = {
  id: 'userId',
  phoneNumber: '13800000000',
};

describe('noticeService', () => {
  const spyResStatus = jest.fn();
  const spyResSend = jest.fn();

  const spyReq: any = { params: { id: 'id' } };
  const spyRes: any = {
    status: spyResStatus.mockReturnValue({ send: spyResSend }),
  };
  const spyNext = jest.fn();

  describe('createNotice', () => {
    it('should return 201 when create SMS notice', async () => {
      const createdSMSEvidence = {
        id: 1,
        good_id: '1',
        user_id: 'userId',
        is_owner: false,
        status: 'CREATED',
      };

      mocked(getGoodInfo).mockResolvedValue(good);
      mocked(getUserInfo).mockResolvedValue(userInfo);
      mocked(createSMSEvidence).mockResolvedValue(createdSMSEvidence);
      mocked(SMSResponse).mockReturnValue({
        isSuccessed: () => true,
      } as any);
      mocked(sendSMS).mockResolvedValue(new SMSResponse(Number()));

      await createNotice(spyReq, spyRes, spyNext);

      expect(sendSMS).toHaveBeenCalledWith(createdSMSEvidence);
      expect(spyResStatus).toHaveBeenCalledWith(201);
      expect(spyResSend).toHaveBeenCalledWith(createdSMSEvidence);
    });

    it('should return 400 when user has no phoneNumber', async () => {
      mocked(getGoodInfo).mockResolvedValue(good);
      mocked(getUserInfo).mockResolvedValue({
        ...userInfo,
        phoneNumber: undefined,
      });

      await createNotice(spyReq, spyRes, spyNext);

      expect(spyResStatus).toHaveBeenCalledWith(400);
      expect(spyResSend).toHaveBeenCalled();
      expect(spyNext).toHaveBeenCalled();
    });

    it('should return 400 when user has invalid phoneNumber', async () => {
      mocked(getGoodInfo).mockResolvedValue(good);
      mocked(getUserInfo).mockResolvedValue({
        ...userInfo,
        phoneNumber: '111111',
      });

      await createNotice(spyReq, spyRes, spyNext);

      expect(spyResStatus).toHaveBeenCalledWith(400);
      expect(spyResSend).toHaveBeenCalled();
      expect(spyNext).toHaveBeenCalled();
    });
  });

  describe('updateNotice', () => {
    it('should return 200 when update notice successed', async () => {
      const createdSMSEvidence = {
        id: 1,
        good_id: '1',
        user_id: 'userId',
        is_owner: false,
        status: 'CREATED',
      };
      const updatedSMSEvidence = {
        ...createdSMSEvidence,
        status: 'SENT',
      };
      mocked(getSMSEvidence).mockResolvedValue(createdSMSEvidence);
      mocked(updateSMSEvidence).mockResolvedValue(updatedSMSEvidence);

      await updateNotice(spyReq, spyRes, spyNext);

      expect(updateSMSEvidence).toHaveBeenCalledWith(updatedSMSEvidence);
      expect(spyResStatus).toHaveBeenCalledWith(200);
      expect(spyResSend).toHaveBeenCalledWith(updatedSMSEvidence);
    });
  });
});
