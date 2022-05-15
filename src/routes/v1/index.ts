import { Router } from 'express';

import bidContract from './bidContract';

const router = Router();

router.use('/bid-contracts', bidContract);

export default router;
