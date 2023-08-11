import bcrypt from "bcryptjs";

import { Op } from "sequelize";
import User from "../../database/model/User";

function register(req, res) {
  const { username, email, password } = req.body;
  let saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  User.create({ username: username, email: email, password: hashedPassword })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    });
  res.status(200).json({ message: "Register" });
}

async function login(req, res) {
  const { identifier, password } = req.body;
  const data = await User.findOne({
    where: {
      [Op.or]: [{ username: identifier }, { email: identifier }],
    },
  });

  const user = data.dataValues;
  console.log(user);

  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      req.session.auth = user.id;
      const serverRes = {
        message: "Login successful",
        data: user,
        session: req.session,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "Login Unsuccesful",
        error: "Invalid credential",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}

function logout(req, res) {
  const session = req.session.destroy();
  console.log(session);
  res.status(200).json({ message: "Successfully logout" });
}

const authController = { register, login, logout };

export default authController;
