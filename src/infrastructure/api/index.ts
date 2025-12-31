import express from 'express';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import PostgresUserRepository from '../persistence/postgres-user-repository';

const app = express();
app.use(express.json());

app.get("/", async (_, res) => {
  const repo = new PostgresUserRepository();
  console.log(await repo.getById(1));
  res.send("Welcome to the API");
});

app.use("/auth", authRouter);
app.use("/health", healthRouter);

export default app;