import express from 'express';
import userRouter from './routes/user';
import healthRouter from './routes/health';

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to the API");
});

app.use("/user", userRouter);
app.use("/health", healthRouter);

export default app;