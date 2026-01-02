import express from "express";
import controller from "../auth.container";

const router = express.Router();

router.get("/register", async (req, res) => {
  const result = await controller.register(req.body);
  res.status(result.statusCode).json(result.body);
});

export default router;