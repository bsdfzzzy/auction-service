import { mocked } from 'ts-jest/utils';
import { getRepository } from 'typeorm';

import { createPaymentEvidence, getPaymentEvidence, updatePaymentEvidence } from './paymentRepository';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    getRepository: jest.fn(),
  };
});

describe('PaymentRepository', () => {
  const mockCreate = jest.fn();
  const mockSave = jest.fn();
  const mockFindOne = jest.fn();

  beforeEach(() => {
    mocked(getRepository).mockReturnValue({
      create: mockCreate,
      save: mockSave,
      findOne: mockFindOne,
      Entity: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call correct function when creating payment evidence', async () => {
    const paymentEvidence = {
      good_id: 'goodId',
      amount: 1000,
      status: 'WAITING_FOR_PAYMENT',
    };
    const storedPaymentEvidence = {
      ...paymentEvidence,
      id: '1',
    };
    mockCreate.mockResolvedValue(storedPaymentEvidence);

    await createPaymentEvidence(paymentEvidence);

    expect(mockCreate).toHaveBeenCalledWith(paymentEvidence);
    expect(mockSave).toHaveBeenCalledWith(storedPaymentEvidence);
  });

  it('should call correct function when getting payment evidence', async () => {
    const paymentEvidence = {
      good_id: 'goodId',
      amount: 1000,
      status: 'WAITING_FOR_PAYMENT',
    };
    const storedPaymentEvidence = {
      ...paymentEvidence,
      id: '1',
    };
    mockFindOne.mockResolvedValue(storedPaymentEvidence);

    const foundPaymentEvidence = await getPaymentEvidence('1');

    expect(mockFindOne).toHaveBeenCalledWith('1');
    expect(foundPaymentEvidence).toEqual(storedPaymentEvidence);
  });

  it('should call correct function when updating payment evidence', async () => {
    const paymentEvidence = {
      id: '1',
      good_id: 'goodId',
      amount: 1000,
      status: 'WAITING_FOR_PAYMENT',
    };

    await updatePaymentEvidence('1', paymentEvidence);

    expect(mockSave).toHaveBeenCalledWith(paymentEvidence);
  });
});
