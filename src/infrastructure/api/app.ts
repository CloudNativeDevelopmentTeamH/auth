import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.ts';
import healthRouter from './routes/health.ts';
import middleware from '../utils/middleware.ts';

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(middleware.logger);
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