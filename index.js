import 'dotenv/config';

import express from 'express';

import openAPI from './open-api/open-api.js';
import addApp from './tools/add.js';
import datetimeApp from './tools/datetime.js';
import memoryApp from './tools/memory.js';

const app = express();

if (process.env.API_KEY) {
  console.log('API key is required!');
  app.use((req, res, next) => {
    const receivedKey = req.headers.authorization
      ?.replace(/^Bearer /, '')
      ?.replace(/^Basic /, '');

    if (receivedKey !== process.env.API_KEY) {
      return res.status(401).send('Unauthorized');
    } else {
      next();
    }
  });
}

app.use(openAPI);

app.get('/', (req, res) => {
  res.send(`AI Assistant Tools: It works!`);
});

app.use(datetimeApp);
app.use(addApp);
app.use(memoryApp);

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
