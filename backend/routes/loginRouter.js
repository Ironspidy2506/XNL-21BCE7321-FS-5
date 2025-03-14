import express from "express";
import { loginUser, registerUser } from "../controllers/loginController.js";

const loginRouter = express.Router();

// Route for user registration (Sign Up)
loginRouter.post("/signup", registerUser);

// Route for user login
loginRouter.post("/login", loginUser);

export default loginRouter;
