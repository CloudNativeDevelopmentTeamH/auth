import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.ts';
import healthRouter from './routes/health.ts';
import middleware from '../utils/middleware.ts';
import config from '../utils/config.ts';

const app = express();

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (config.corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
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