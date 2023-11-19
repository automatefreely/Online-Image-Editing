const express = require("express");
const { postImagesUploader } = require("../uploads/handle.uploads");
const {
    createPost,
    getPosts,
    getAllPosts,
    addImagesToPost,
    getMyPosts,
} = require("../controllers/post.controllers");
const { isAuthorised } = require("../middlewares/auth.middewares");
const router = express.Router();

router.route("/create").post(isAuthorised, postImagesUploader, createPost);
router.route("/all").get(isAuthorised, getAllPosts);
router.route("/:postId").get(isAuthorised, getPosts);
router.route("/:postId/add").post(isAuthorised, postImagesUploader, addImagesToPost);
router.route("/user").get(isAuthorised, getMyPosts);

module.exports = router;
