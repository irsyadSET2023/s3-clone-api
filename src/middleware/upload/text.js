import multer from "multer";
import path from "path";
import File from "../../database/model/File";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadImage = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const fileSize = parseInt(req.headers["content-length"]);
    const maxSize = 1500000;
    const whitelistExt = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    const whitelistMimeType = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
    ];

    // check for file format
    if (
      !whitelistMimeType.includes(file.mimetype) &&
      !whitelistExt.includes(extension)
    ) {
      req.uploadError = "Only jpeg, jpg, png, gif and webp are allowed";
      return cb(null, false);
    }

    // check for file size
    if (fileSize > maxSize) {
      req.uploadError = "Max size upload is 1.5mb";
      return cb(null, false);
    }
    cb(null, true);
  },
});

export function uploadError(req, res, next) {
  if (req.uploadError) {
    res.status(403).json({ error: req.uploadError });
    return;
  } else {
    next();
  }
}

export async function storeImage(req, res, next) {
  try {
    const storedFile = await File.create({
      ...req.file,
      path: req.file.path.replace("public\\", ""),
      created_by: req.session.auth,
    });
    req.file = storedFile;
    res.status(200).json({
      message: `Profile picture for user ${req.session.auth} is uploaded`,
    });
    // next();
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
}

export default uploadImage;
