import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import healthRouter from './routes/health';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", async (_, res) => {
  res.send("Welcome to the API");
});

app.use("/auth", authRouter);
app.use("/health", healthRouter);

export default app;