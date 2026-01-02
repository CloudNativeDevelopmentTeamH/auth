import express from "express";
import User from "../../../entities/user";
import AuthController from "../../../adapters/AuthController";
import RegisterUser from "../../../usecases/register";
import LoginUser from "../../../usecases/login";
import FetchUserProfile from "../../../usecases/profile";
import LogoutUser from "../../../usecases/logout";
import AuthenticateUser from "../../../usecases/authenticate";
import DeleteUser from "../../../usecases/delete";
import AuthPresenter from "../../../adapters/AuthPresenter";

const controller = new AuthController(
  new RegisterUser(),
  new LoginUser(),
  new FetchUserProfile(),
  new LogoutUser(),
  new AuthenticateUser(),
  new DeleteUser(),
  new AuthPresenter(),
);

const router = express.Router();

router.get("/", (req, res) => {
  const user = new User(1, "John Doe", "john.doe@example.com");
  res.send(user);
});

export default router;