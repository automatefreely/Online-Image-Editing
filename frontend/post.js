class Post{
    constructor(user) {
        this.currentPost = null;
        this.postUnderEdit = null;
        this.user = user
    }

    async createPost(formData) {
        const URL = "http://localhost:4000/api/post/create";
        try {
            const response = await fetch(URL, {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            const result = await response.json();
            console.log(result);

            if (result.result) {
                console.log("Post created successfully");
                this.user.getProfile();
            }
        } catch (error) {
            console.log(error);
        }
    }

    
}