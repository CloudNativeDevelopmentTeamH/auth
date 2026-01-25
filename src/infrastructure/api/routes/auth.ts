import express from "express";
import controller from "../auth.container.ts";

const COOKIE_NAME = "auth_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  // secure: true
  secure: false,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
  // sameSite: "strict" as const
  sameSite: "lax" as const  // "strict" doesn't work well with HTTP
}
  
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const result = await controller.register({ body: req.body });
    res.status(result.statusCode).json(result.body);
  }
  catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await controller.login({ body: { email, password } });
    res
      .status(result.statusCode)
      .cookie(COOKIE_NAME, result.token, COOKIE_OPTIONS)
      .json(result.body);
  }
  catch (err) {
    next(err);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    const token = req.cookies?.["auth_token"];
    const result = await controller.profile({ token });
    res.status(result.statusCode).json(result.body);
  }
  catch (err) {
    next(err);
  }
});

router.get("/authenticate", async (req, res, next) => {
  try {
    const token = req.cookies?.["auth_token"];
    const result = await controller.authenticate({ token });
    res.status(result.statusCode).json(result.body);
  }
  catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies?.["auth_token"];
    const result = await controller.logout({ token });
    res
      .status(result.statusCode)
      .clearCookie(COOKIE_NAME)
      .json(result.body);
  }
  catch (err) {
    next(err);
  }
});

router.delete("/delete", async (req, res, next) => {
  try {
    const token = req.cookies?.["auth_token"];
    const result = await controller.delete({ token });
    res.status(result.statusCode).json(result.body);
  }
  catch (err) {
    next(err);
  }
});

export default router;