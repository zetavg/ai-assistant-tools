import { Router } from 'express';

import openAPI from '../open-api/open-api.js';

const router = Router();

router.get(
  '/add',
  openAPI.path({
    operationId: 'add',
    description: 'Adds two numbers and return the result.',
    parameters: [
      {
        name: 'a',
        in: 'query',
        description: 'The first number to add.',
        required: true,
        schema: {
          type: 'number',
        },
      },
      {
        name: 'b',
        in: 'query',
        description: 'The second number to add.',
        required: true,
        schema: {
          type: 'number',
        },
      },
    ],
  }),
  (req, res) => {
    res.send(`${parseFloat(req.query.a) + parseFloat(req.query.b)}`);
  },
);

export default router;
