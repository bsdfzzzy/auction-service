import { SMSResponse } from '../models/notice';
import { SMSEvidence } from '../typeorm/entities/orders/SMSEvidence';
import { send } from '../utils/queue';

export const sendSMS = async (smsEvidence: SMSEvidence): Promise<SMSResponse> => {
  const response = await send(smsEvidence);
  return new SMSResponse(response.status);
};
