import express from 'express';
import { Router } from 'express';
import { nanoid } from 'nanoid';

import mongodbClient from '../mongodb/client.js';
import openAPI from '../open-api/open-api.js';
const router = Router();

router.use(express.json());

router.post(
  '/memories',
  openAPI.path({
    operationId: 'remember',
    description:
      'The `remember` tool allows you to persist information across conversations. Address your message to this tool and write whatever information you want to remember. The information will appear in the model set context below in future conversations.\n\nHere are some examples memory messages, which you should follow such style when writing your own:\n\n- `Is an experienced developer and prefers direct and short answers without explanations of basic concepts.`\n- `Uses ESLint and Prettier for their current projects. They prefer using Yarn.`\n- `Likes eating sashimi.`\n- `Prefers well-considered and thoughtful opinions on various topics during conversations, rather than superficial neutrality.`\n- `The famous restaurant in Xinyi District A13 near Taipei 101, known for its xiaolongbao, is called "Din Tai Fung."`',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'string',
                description: 'The ID of the user to remember information for.',
              },
              memory: {
                type: 'string',
                description: 'The information to remember.',
              },
            },
            required: ['memory'],
          },
        },
      },
    },
  }),
  async (req, res) => {
    try {
      const { user_id = 'default', memory } = req.body || {};

      // if (!user_id) {
      //   return res.status(400).json({
      //     error: '`user_id` is required.',
      //     message: '`user_id` is required.',
      //     details:
      //       'This API expects the user_id, which is the ID of the user to remember information for, to be provided in the request body as JSON. For example: { "user_id": "123", "memory": "Remember this." }.',
      //   });
      // }

      if (!memory) {
        return res.status(400).json({
          error: '`memory` is required.',
          message: '`memory` is required.',
          details:
            'This API expects the memory to be provided in the request body as JSON. For example: { "user_id": "123", "memory": "Remember this." }.',
        });
      }

      const db = mongodbClient.db();
      const collection = db.collection('memories');

      const memory_id = nanoid();
      await collection.insertOne({ memory_id, user_id, memory });

      res.status(201).json({
        message: 'Memory saved successfully.',
        memory_id,
        user_id,
        memory,
      });
    } catch (error) {
      console.error('Error saving memory:', error);
      res.status(500).json({ error: 'Failed to save memory.' });
    }
  },
);

router.get(
  '/memories',
  openAPI.path({
    operationId: 'get-memories',
    description: 'Retrieve memories that have been saved for a user.',
    parameters: [
      {
        name: 'user_id',
        in: 'query',
        description: 'The ID of the user to retrieve memories for.',
        required: false,
        schema: { type: 'string' },
      },
    ],
  }),
  async (req, res) => {
    try {
      const { user_id = 'default' } = req.query || {};

      // if (!user_id) {
      //   return res.status(400).json({
      //     error: '`user_id` is required.',
      //     message: '`user_id` is required.',
      //     details:
      //       'This API expects the user_id, which is the ID of the user to retrieve memories for, to be provided in the query string. For example: /memories?user_id=abcd.',
      //   });
      // }

      const db = mongodbClient.db();
      const collection = db.collection('memories');

      const memories = await collection.find({ user_id }).toArray();

      res.status(200).json(memories);
    } catch (error) {
      console.error(`Error retrieving memory for user:`, error);
      res.status(500).json({ error: 'Failed to save memory.' });
    }
  },
);

router.delete(
  '/memories',
  openAPI.path({
    operationId: 'forget',
    description:
      'Delete a specific memory for a user using user_id and memory_id.',
    parameters: [
      {
        name: 'user_id',
        in: 'query',
        description: 'The ID of the user whose memory is to be deleted.',
        required: false,
        schema: { type: 'string' },
      },
      {
        name: 'memory_id',
        in: 'query',
        description: 'The ID of the memory to delete.',
        required: true,
        schema: { type: 'string' },
      },
    ],
  }),
  async (req, res) => {
    try {
      const { user_id = 'default', memory_id } = req.query || {};

      if (!user_id || !memory_id) {
        return res.status(400).json({
          error: '`user_id` and `memory_id` are required.',
          message: '`user_id` and `memory_id` are required.',
          details:
            'This API expects the user_id, which is the ID of the user whose memory is to be deleted, and the memory_id, which is the ID of the memory to delete, to be provided in the query string. For example: /memories?user_id=abcd&memory_id=123.',
        });
      }

      const db = mongodbClient.db();
      const collection = db.collection('memories');

      const result = await collection.deleteOne({ user_id, memory_id });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: 'Memory not found.',
          message: 'No memory found with the provided user_id and memory_id.',
        });
      }

      res.status(200).json({ message: 'Memory deleted successfully.' });
    } catch (error) {
      console.error('Error deleting memory:', error);
      res.status(500).json({ error: 'Failed to delete memory.' });
    }
  },
);

router.delete(
  '/memories/all',
  openAPI.path({
    operationId: 'forget-all',
    description: 'Delete all memories for a specific user using user_id.',
    parameters: [
      {
        name: 'user_id',
        in: 'query',
        description: 'The ID of the user whose memories are to be deleted.',
        required: true,
        schema: { type: 'string' },
      },
    ],
  }),
  async (req, res) => {
    try {
      const { user_id } = req.query || {};

      if (!user_id) {
        return res.status(400).json({
          error: '`user_id` is required.',
          message: '`user_id` is required.',
          details:
            'This API expects the user_id, which is the ID of the user whose memories are to be deleted, to be provided in the query string. For example: /memories/all?user_id=abcd.',
        });
      }

      const db = mongodbClient.db();
      const collection = db.collection('memories');

      const result = await collection.deleteMany({ user_id });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: 'No memories found.',
          message: 'No memories found for the provided user_id.',
        });
      }

      res.status(200).json({ message: 'All memories deleted successfully.' });
    } catch (error) {
      console.error('Error deleting memories:', error);
      res.status(500).json({ error: 'Failed to delete memories.' });
    }
  },
);

export default router;
