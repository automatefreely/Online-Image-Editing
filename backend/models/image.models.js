const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
        select: false,
    },
    image: {
        type: String,
        required: [true, "Image is required"],
    },
    original: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const Image = mongoose.model("image", ImageSchema);

module.exports = Image;
