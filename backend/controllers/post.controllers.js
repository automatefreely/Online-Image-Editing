const Post = require("../models/post.models");
const User = require("../models/user.models");
const Image = require("../models/image.models");

exports.createPost = async (req, res) => {
    try {
        const imageFile = req.file;
        const userId = req.user._id;

        if (!imageFile) {
            return res.status(400).json({
                result: false,
                message: "Image is required",
            });
        }

        const user = await User.findById(userId);

        const image = await Image.create({
            image: imageFile.filename,
            user: userId,
            url:
                process.env.BASE_URL +
                "/api/public/posts/" +
                userId.toString() +
                "/" +
                imageFile.filename,
        });

        const post = await Post.create({
            images: [image._id],
            user: userId,
        });

        user.posts.push(post._id);
        await user.save();

        return res.status(201).json({
            result: true,
            message: "Image saved successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId).populate({
            path: "images",
            select: "url",
        });

        // check if post exists
        if (!post) {
            return res.status(400).json({
                result: false,
                message: "Post not found",
            });
        }

        // check if post belongs to user
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                result: false,
                message: "You are not authorized to view this post",
            });
        }

        return res.status(200).json({
            result: post,
            message: "Posts fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getMyPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId);

        const posts = await Post.find({ user: userId }).populate({
            path: "images",
            select: "url",
        });

        return res.status(200).json({
            result: posts,
            message: "Posts fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const skip = req.query.skip || 0;

        const posts = await Post.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate({
                path: "images",
                select: "url",
            });

        return res.status(200).json({
            result: posts,
            message: "Posts fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.addImagesToPost = async (req, res) => {
    try {
        const imageFile = req.file;
        const postId = req.params.postId;
        const userId = req.user._id;

        if (!imageFile) {
            return res.status(400).json({
                result: false,
                message: "Image is required",
            });
        }

        if (!postId) {
            return res.status(400).json({
                result: false,
                message: "Post ID is required",
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                result: false,
                message: "Post not found",
            });
        }

        const image = await Image.create({
            image: imageFile.filename,
            user: userId,
            url:
                process.env.BASE_URL +
                "/api/public/posts/" +
                userId.toString() +
                "/" +
                imageFile.filename,
            original: false,
        });

        post.images.push(image._id);

        await post.save();

        return res.status(201).json({
            result: true,
            message: "Image saved successfully",
            post,
        });
    } catch (err) {
        return res.status(500).json({
            result: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
