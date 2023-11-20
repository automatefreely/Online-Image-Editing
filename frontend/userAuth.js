class User {
    constructor() {
        this.name = null;
        this.profilePic = null;
        this.posts = [];
        this.email = null;

        this.isLogin = false;

        this.currentPost = null;
    }

    async getProfile() {
        const URL = "http://localhost:4000/api/user/profile";
        try {
            const response = await fetch(URL, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);

            if (result.result) {
                this.name = result.user.name;
                this.profilePic = result.user.profilePic;
                this.posts = result.user.posts;
                this.email = result.user.email;
                this.isLogin = true;
            } else {
                // window.location.href = "http://localhost:4000/login";
            }
        } catch (error) {
            console.log(error);
        }
    }

    async createNewPost(imageFormData) {
        const URL = "http://localhost:4000/api/post/create";
        try {
            const response = await fetch(URL, {
                method: "POST",
                body: imageFormData,
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);

            if (result.result) {
                console.log("Post created successfully " + result.post);
                this.getProfile();

                this.currentPost = result.post;

                // local storage
                localStorage.setItem(
                    "currentPost",
                    JSON.stringify(this.currentPost)
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    async addImageToPost(postId, imageFormData) {
        const URL = `http://localhost:4000/api/post/${postId}/add`;
        try {
            const response = await fetch(URL, {
                method: "POST",
                body: imageFormData,
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);

            if (result.result) {
                console.log("Image added successfully " + result.post);
                this.getProfile();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async logout() {
        this.name = null;
        this.profilePic = null;
        this.posts = [];
        this.email = null;

        this.isLogin = false;
    }

    async login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const data = { email, password };

        const URL = "http://localhost:4000/api/user/login";
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);
            if (result.result) {
                this.getProfile();
                window.location.href = "http://localhost:4000/";
            } else {
                console.log("Invalid credentials");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async signup() {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const data = { name, email, password };

        const URL = "http://localhost:4000/api/user/register";
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);
            if (result.result) {
                this.getProfile();
                window.location.href = "http://localhost:4000/";
            } else {
                console.log("Invalid credentials");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async handleCredentialResponse(googleUser) {
        console.log("googleUser", googleUser);
        // send this credential to backend

        const URL = "http://localhost:4000/api/user/signin/google";
        const data = { token: googleUser.credential };
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);

            if (result.result) {
                this.getProfile();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getPost(postId) {
        const URL = `http://localhost:4000/api/post/${postId}`;
        try {
            const response = await fetch(URL, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (result.result) {
                console.log(result.post);
                return result.post;
            }

            if (result.result) {
                return result.post;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async logout() {
        const URL = "http://localhost:4000/api/user/logout";
        try {
            const response = await fetch(URL, {
                method: "PUT",
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);

            if (result.result) {
                this.email = null;
                this.name = null;
                this.profilePic = null;
                this.posts = [];
                this.isLogin = false;
            }
        } catch (error) {
            console.log(error);
        }
    }
}
