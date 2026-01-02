import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import middleware from '../utils/middleware';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', async (_, res) => {
  res.send("Welcome to the API");
});

app.use('/auth', authRouter);
app.use('/health', healthRouter);

app.use(middleware.notFound)
app.use(middleware.errorHandler);

export default app; 