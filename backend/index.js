const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const connectDB = require("./utils/db.utils");

const app = express();
connectDB();
app.use(express.json());
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "SECRET",
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);
const postRoutes = require("./routes/post.routes");
app.use("/api/post", postRoutes);

app.get("/api", (req, res) => {
    res.send("API live");
});
console.log(process.env.PORT);

const path = require("path");

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "../frontend")));
app.get("/", (req, res) =>
    res.sendFile(path.join(_dirname, "../frontend/index.html"))
);
app.get("/edit", (req, res) =>
    res.sendFile(path.join(_dirname, "../frontend/edit.html"))
);
app.get("/edit/:postId", (req, res) =>
    res.sendFile(path.join(_dirname, "../frontend/edit.html"))
);
app.get("/login", (req, res) =>
    res.sendFile(path.join(_dirname, "../frontend/signin.html"))
);
app.get("/register", (req, res) =>
    res.sendFile(path.join(_dirname, "../frontend/signup.html"))
);
app.get("/dashboard", (req, res) =>
    res.sendFile(path.join(_dirname, "../frontend/dashboard.html"))
);

app.use("/api/public/posts", express.static("uploads/public/posts"));
app.use("/api/public/users", express.static("uploads/public/users"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
