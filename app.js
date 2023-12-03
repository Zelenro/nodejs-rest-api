import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRouter from './routes/api/auth-router.js';
import contactsRouter from './routes/api/contacts-router.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(cors());
app.use(logger(formatsLogger));
app.use(express.json());

app.use('/users', authRouter);
app.use('/api/contacts', contactsRouter);

app.use(express.static(join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.status(200);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
