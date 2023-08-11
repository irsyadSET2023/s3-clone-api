import { Router } from "express";
import {
  loginValidator,
  registorValidator,
} from "../middleware/validator/auth";
import authController from "../controllers/auth";
import { validate } from "../middleware/validator";
import isAuthenticated from "../middleware/isAuthenthicated";

const apiRoutes = Router();
apiRoutes.post("/user", registorValidator, validate, authController.register);
apiRoutes.post("/user/login", loginValidator, validate, authController.login);
apiRoutes.post("/user/logout", isAuthenticated, authController.logout);
export default apiRoutes;
