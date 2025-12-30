import express from 'express';
import authRouter from './routes/auth';
import healthRouter from './routes/health';

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to the API");
});

app.use("/auth", authRouter);
app.use("/health", healthRouter);

export default app;