import express from "express";
import controller from "../auth.container";

const router = express.Router();

router.post("/register", async (req, res) => {
  const result = await controller.register({ body: req.body });
  res.status(result.statusCode).json(result.body);
});

router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await controller.login({ body: { email, password } });
  res
    .status(result.statusCode)
    .cookie(result.cookie!.name, result.cookie!.value, result.cookie!.options)
    .json(result.body);
});

router.get("/profile", async (req, res) => {
  const token = req.cookies?.["auth_token"];
  const result = await controller.profile({ token });
  res.status(result.statusCode).json(result.body);
});

router.get("/authenticate", async (req, res) => {
  const token = req.cookies?.["auth_token"];
  const result = await controller.authenticate({ token });
  res.status(result.statusCode).json(result.body);
});

router.post("/logout", async (req, res) => {
  const token = req.cookies?.["auth_token"];
  const result = await controller.logout({ token });
  res
    .status(result.statusCode)
    .cookie(result.cookie!.name, result.cookie!.value, result.cookie!.options)
    .json(result.body);
});

router.delete("/delete", async (req, res) => {
  const token = req.cookies?.["auth_token"];
  const result = await controller.delete({ token });
  res.status(result.statusCode).json(result.body);
});

export default router;