import { Router } from 'express';

import {
  finalPaymentConfirmationRequestValidator,
  finalPaymentRequestValidator,
} from '../../middleware/validation/finalPayment';
import { finalPayment, finalPaymentConfirmation } from '../../services/paymentService';

const router = Router();

router.post('/:id/final-payments', [finalPaymentRequestValidator], finalPayment);
router.post(
  '/:id/final-payments/:fid/confirmation',
  [finalPaymentConfirmationRequestValidator],
  finalPaymentConfirmation,
);
router.post('/:id/final-payments/:fid', [getFinalPaymentEvidenceRequestValidator], finalPayment);

export default router;
