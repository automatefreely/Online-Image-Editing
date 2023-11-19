const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
});