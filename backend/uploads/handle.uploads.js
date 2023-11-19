const multer = require("multer");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const profilePicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "public", "users"));
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, req.user._id.toString() + path.extname(file.originalname));
    },
});

const postImagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pth = path.join(
            __dirname,
            "public",
            "posts",
            req.user._id.toString()
        );
        fs.mkdirSync(pth, { recursive: true });
        cb(null, pth);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() +
                "-" +
                file.originalname.split(".")[0] +
                path.extname(file.originalname)
        );
    },
});

const profilePicUploader = multer({ storage: profilePicStorage }).single(
    "profilePic"
);

const postImagesUploader = multer({ storage: postImagesStorage }).single(
    "postImage"
);

module.exports = {
    profilePicUploader,
    postImagesUploader,
};
