import { Router } from "express";
import uploadImage, { uploadError } from "../middleware/upload/image";
import isAuthenticated from "../middleware/isAuthenthicated";
import uploadImageController from "../controllers/upload/image";

const uploadRoutes = Router();

uploadRoutes.post(
  "/profile-picture",
  isAuthenticated,
  uploadImage.single("profile-picture"),
  uploadError,
  uploadImageController.storeImage
);

uploadRoutes.put(
  "/profile-picture",
  isAuthenticated,
  uploadImage.single("profile-picture"),
  uploadError,
  uploadImageController.updateProfileImage
);

uploadRoutes.delete(
  "/profile-picture",
  uploadImageController.deleteProfileImage
);

uploadRoutes.post("/resume", function (req, res) {
  res.status(200).json({ file: "resume" });
});

export default uploadRoutes;
