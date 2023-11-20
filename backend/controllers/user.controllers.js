const User = require("../models/user.models");

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .select("-password")
            .populate({
                path: "posts",
                populate: {
                    path: "images",
                    select: "url __created",
                },
            });
        res.status(200).send({
            result: true,
            message: "User profile",
            user,
        });
    } catch (error) {
        res.status(500).send({
            result: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
