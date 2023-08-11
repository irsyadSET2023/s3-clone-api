import { body } from "express-validator";
import { Op } from "sequelize";
import User from "../../database/model/User";

export const loginValidator = [
  body("identifier").custom(async function (value) {
    const user = await User.findOne({
      atttibutes: ["identifier"],
      where: { [Op.or]: [{ username: value }, { email: value }] },
    });
    if (!user) {
      throw new Error("User Does Not Exist");
    }
  }),
];

export const registorValidator = [
  body("username")
    .notEmpty()
    .withMessage("User Name must not be empty")
    .isAlpha()
    .withMessage("Must Be Alphabet Only")
    .custom(async function (value) {
      const user = await User.findOne({
        where: { username: value },
      });
      if (user) {
        throw new Error("This User Name Already Exist");
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Must be email")
    .custom(async function (value) {
      const user = await User.findOne({
        where: { email: value },
      });
      if (user) {
        throw new Error("This Email Already Exist");
      }
    }),
  body("password").notEmpty().withMessage("Must not be Empty"),
];
