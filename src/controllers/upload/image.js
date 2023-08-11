import File from "../../database/model/File";
import User from "../../database/model/User";
async function storeImage(req, res) {
  try {
    const storedFile = await File.create({
      ...req.file,
      path: req.file.path.replace("public\\", ""),
      created_by: req.session.auth,
    });
    req.file = storedFile;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }

  try {
    await User.update(
      { profilePictureUrl: req.file.path },
      { where: { id: req.session.auth } }
    );
    res.status(200).json({
      message: `Profile picture for user ${req.session.auth} is uploaded`,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
}

async function updateProfileImage() {
  try {
    const storedFile = await File.update(
      {
        ...req.file,
        path: req.file.path.replace("public\\", ""),
      },
      { where: { created_by: req.session.auth } }
    );
    req.file = storedFile;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }

  try {
    await User.update(
      { profilePictureUrl: req.file.path },
      { where: { id: req.session.auth } }
    );
    res.status(200).json({
      message: `Profile picture for user ${req.session.auth} is updated`,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
}

async function deleteProfileImage(req, res) {
  try {
    await File.destroy({
      where: {
        created_by: req.session.auth,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }

  try {
    await User.update(
      { profilePictureUrl: null },
      { where: { id: req.session.auth } }
    );
    res.status(200).json({
      message: `Profile picture for user ${req.session.auth} is deleted`,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
}

const uploadImageController = {
  storeImage,
  updateProfileImage,
  deleteProfileImage,
};

export default uploadImageController;
