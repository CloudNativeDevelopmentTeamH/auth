import express from "express";
import User from "../../../entities/user";

const router = express.Router();

router.get("/", (req, res) => {
  const user = new User(1, "John Doe", "john.doe@example.com");
  res.send(user);
});

export default router;