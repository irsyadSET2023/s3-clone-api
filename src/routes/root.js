import express from "express";
import getRoot from "../controllers/root/getRoot";
import postRoot from "../controllers/root/postRoot";

const root = express.Router();

root.get("/", getRoot);
root.post("/", postRoot);
root.get("/all", function (req, res) {
  const body = req.body;
  console.log(body);
  res.status(200).json({ body });
});

export default root;
