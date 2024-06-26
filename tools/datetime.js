import { Router } from 'express';

import openAPI from '../open-api/open-api.js';

const router = Router();

router.get(
  '/datetime',
  openAPI.path({
    operationId: 'datetime',
    description: 'Get the current date and time in ISO format.',
  }),
  (req, res) => {
    res.send(new Date().toISOString());
  },
);

export default router;
