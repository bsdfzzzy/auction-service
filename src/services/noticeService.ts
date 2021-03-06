import { NextFunction, Request, Response } from 'express';

import { sendSMS } from '../adapters/smsAdapter';
import { createSMSEvidence, getSMSEvidence, updateSMSEvidence } from '../repositories/smsRepository';

import { getGoodInfo } from './goodService';
import { getUserInfo } from './userService';

export const createNotice = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const good = await getGoodInfo(id);
  const userInfo = await getUserInfo(id);

  if (!userInfo.phoneNumber || !/^1[0-9]{10}$/.test(userInfo.phoneNumber)) {
    res.status(400).send();
    return next();
  }

  const smsEvidence = await createSMSEvidence({
    good_id: id,
    user_id: userInfo.id,
    is_owner: good.ownerId === userInfo.id,
    status: 'CREATED',
  });

  const response = await sendSMS(smsEvidence);

  if (response.isSuccessed()) {
    res.status(201).send(smsEvidence);
  }
};

export const updateNotice = async (req: Request, res: Response, next: NextFunction) => {
  const { nid } = req.params;

  const smsEvidence = await getSMSEvidence(Number(nid));

  const updatedSMSEvidence = await updateSMSEvidence({
    ...smsEvidence,
    status: 'SENT',
  });

  res.status(200).send(updatedSMSEvidence);
};
