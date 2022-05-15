import { NextFunction, Request, Response } from 'express';

import { sendSMS } from '../adapters/smsAdapter';
import { createSMSEvidence } from '../repositories/smsRepository';

import { getGoodInfo } from './goodService';
import { getUserInfo } from './userService';

export const createNotice = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const good = await getGoodInfo(id);
  const userInfo = await getUserInfo(req.headers.token as string);

  const smsEvidence = await createSMSEvidence({
    good_id: id,
    user_id: userInfo.id,
    is_owner: good.ownerId === userInfo.id,
    status: 'CREATED',
  });

  const response = await sendSMS(smsEvidence);

  if (response.isSuccessed()) {
    res.status(201).send();
  }
};
