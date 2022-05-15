import { Router } from 'express';

import {
  finalPaymentConfirmationRequestValidator,
  finalPaymentRequestValidator,
  getFinalPaymentEvidenceRequestValidator,
} from '../../middleware/validation/finalPayment';
import { createNoticeRequestValidator, noticeUpdateRequestValidator } from '../../middleware/validation/notice';
import { createNotice } from '../../services/noticeService';
import { finalPayment, finalPaymentConfirmation, getFinalPaymentEvidence } from '../../services/paymentService';

const router = Router();

router.post('/:id/final-payments', [finalPaymentRequestValidator], finalPayment);
router.post(
  '/:id/final-payments/:fid/confirmation',
  [finalPaymentConfirmationRequestValidator],
  finalPaymentConfirmation,
);
router.get('/:id/final-payments/:fid', [getFinalPaymentEvidenceRequestValidator], getFinalPaymentEvidence);

router.post('/:id/result/notices', [createNoticeRequestValidator], createNotice);
router.post('/:id/result/notices/:nid', [noticeUpdateRequestValidator], getFinalPaymentEvidence);

export default router;
