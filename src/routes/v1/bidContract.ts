import { Router } from 'express';

import { finalPaymentRequestValidator } from '../../middleware/validation/finalPayment';
import { finalPayment, finalPaymentConfirmation } from '../../services/paymentService';

const router = Router();

router.post('/:id/final-payments', [finalPaymentRequestValidator], finalPayment);
router.post('/:id/final-payments/:fid/confirmation', [], finalPaymentConfirmation);

export default router;
