import { getRepository } from 'typeorm';

import { SMSEvidence } from '../typeorm/entities/orders/SMSEvidence';

export const smsRepository = () => getRepository(SMSEvidence);

export const createSMSEvidence = async (smsEvidence: SMSEvidence) => {
  const _smsRepository = smsRepository();
  const smsEvidenceEntity = await _smsRepository.create(smsEvidence);
  return _smsRepository.save(smsEvidence);
};

export const getSMSEvidence = async (id: number) => {
  const _smsRepository = smsRepository();
  return _smsRepository.findOne(id);
};

export const updatePaymentEvidence = async (smsEvidence: SMSEvidence): Promise<SMSEvidence> => {
  const _smsRepository = smsRepository();
  return _smsRepository.save(smsEvidence);
};
