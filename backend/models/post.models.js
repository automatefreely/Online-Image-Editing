const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
        select: false,
    },
    images: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "image",
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
