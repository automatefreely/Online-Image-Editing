const User = require("../models/user.models");
const jwt = require("jsonwebtoken");

exports.isAuthorised = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // const token = req.headers["authorization"];

        console.log(req.cookies);
        if (!token) {
            return res.status(401).send({
                result: false,
                err: "Unauthorized",
            });
        }
        // console.log(process.env.JWT_KEY);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // console.log(decoded, decoded._id)
        const user = await User.findById(decoded._id);
        //  console.log(user)

        if (!user) {
            return res.status(404).send({
                result: false,
                err: "User not found",
            });
        }

        req.user = user;
        // console.log(user)
        next();
    } catch (err) {
        res.status(500).send({
            result: false,
            err: err.message,
        });
    }
};