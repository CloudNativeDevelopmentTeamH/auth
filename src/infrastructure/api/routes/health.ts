import express from 'express';

const router = express.Router();

router.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});

export default router;