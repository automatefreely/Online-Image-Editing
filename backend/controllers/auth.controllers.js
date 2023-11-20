const User = require("../models/user.models");
const { sendEmail } = require("../utils/sendEmail.utils");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

exports.googleIdVerifyAndLogin = async (req, res) => {
    try {
        console.log(req.body);
        const { token } = req.body;
        const client = new OAuth2Client();
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience:
                    "146513608875-jknpjp0e5201t77ardbb17e7gsi13hj7.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload["sub"];
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
            console.log(userid);
            const email = payload.email;
            const name = payload.name;
            const user = await User.findOne({ email });

            if (!user) {
                const newUser = await User.create({
                    name,
                    email,
                    googleID: userid,
                });
                const options = {
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };

                const token = await newUser.generateToken();

                return res.status(201).cookie("token", token, options).send({
                    message: "Regitation successfully",
                    result: newUser,
                    token,
                });
            } else {
                const options = {
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };

                const token = await user.generateToken();

                return res.status(201).cookie("token", token, options).send({
                    message: "User logged in successfully",
                    result: user,
                    token,
                });
            }
        }

        const data = await verify();
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({
                result: false,
                err: "All fields are required",
                message: "Please fill all the fields",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).send({
                result: false,
                err: "User already exist with this email",
                message: "Try logging in instead",
            });
        }

        user = await User.create({
            name,
            email,
            password,
        });

        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        const token = await user.generateToken();

        res.status(201).cookie("token", token, options).send({
            message: "User logged in successfully",
            result: user,
            token,
        });
    } catch (err) {
        res.status(500).send({
            result: false,
            err: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(400).send({
                result: false,
                err: "All fields are required",
                message: "Please fill all the fields",
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).send({
                result: false,
                err: "User not found",
                message: "Please register first",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).send({
                result: false,
                err: "Invalid password",
                message: "Please enter correct password",
            });
        }

        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        const token = await user.generateToken();

        res.status(200).cookie("token", token, options).send({
            message: "User logged in successfully",
            result: true,
            token,
        });
    } catch (err) {
        res.status(500).send({
            result: false,
            err: err.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send({
                result: false,
                err: "Please provide old and new password",
                message: "Please fill all the fields",
            });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).send({
                result: false,
                err: "Invalid password",
                message: "Please enter correct password",
            });
        }

        user.password = newPassword;
        await user.save();

        // create a notification
        const notification = await Notification.create({
            message: "Password changed successfully",
            type: NotificationType.PASSWORD_CHANGED,
        });
        res.status(200).send({
            result: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
            message: "internal server error",
        });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(400).send({
                result: false,
                err: "Email is required",
            });
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({
                result: false,
                err: "User not found",
            });
        }

        const token = await user.generatePasswordReset();
        await user.save();

        const resetLink = `${req.protocol}://${req.get(
            "host"
        )}/password/reset/${token}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetLink} clicktracking=off>${resetLink}</a>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            // create notification to inform user a password request sent
            const notification = new Notification({
                message: "Password reset requested",
                type: NotificationType.PASSWORD_RESET_REQUEST,
            });
            await notification.save();

            user.notifications.push(notification);
            await user.save();

            res.status(200).send({
                result: true,
                message: "mail sent! Please check your email",
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            return res.status(500).send({
                result: false,
                message: "Email could not be sent",
                err: error.message,
            });
        }
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        if (!req.body.password) {
            res.status(400).send({
                result: false,
                err: "Please provide the security code",
            });
        }
        if (!req.body.password) {
            res.status(400).send({
                result: false,
                err: "Please provide the password",
            });
        }
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send({
                result: false,
                err: "Invalid Token or Token Expired",
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send({
            result: true,
            message: "Password reset successful",
        });
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const options = {
            expires: new Date(Date.now()),
            httpOnly: true,
        };

        return res.status(200).cookie("token", "", options).send({
            result: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).send({
            result: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
