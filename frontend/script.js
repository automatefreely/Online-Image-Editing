var user;
if (!user) user = new User();
// user.getProfile();

async function handleRoute() {
    const url = window.location.href;
    console.log(url);
    await user.getProfile();
    onLogin();
    console.log(user);
    const domManager = new DOMManager(user);
    if (url === "http://localhost:4000/") {
        console.log("home");
        domManager.loadHistoryImages();
    } else if (url === "http://localhost:4000/login") {
        console.log("login");
        // loadLogin();
    } else if (url === "http://localhost:4000/signup") {
        // loadSignup();
        console.log("signup");
    } else if (url === "http://localhost:4000/edit") {
        // loadProfile();
        domManager.handleEdit();
        console.log("edit");
    }
}

// Listen for hash changes and update the content accordingly
window.addEventListener("hashchange", handleRoute);

// Initial call to set content based on the current hash
handleRoute();

class DOMManager {
    constructor(user) {
        this.user = user;
    }

    handleEdit() {
        console.log("Hi");
        // get the current post from local storage
        const post = JSON.parse(localStorage.getItem("currentPost"));
        user.currentPost = post;
        console.log(user);
        if (user.currentPost !== null) {
            console.log(user.currentPost);
            const imgUrl = user.currentPost.images[0].url;
            // load the image
            fetch(imgUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    handleCrop(
                        blob,
                        false,
                        user.currentPost.images[0].url.split("/").pop()
                    );
                });
        } else {
            console.log("No post to edit");
        }
    }

    getAge(time) {
        const date = new Date(time);
        const age = Date.now() - date.getTime();
        // make good formatting
        const days = Math.floor(age / (1000 * 60 * 60 * 24));
        if (days > 0) return `${days} days ago`;
        const hours = Math.floor(age / (1000 * 60 * 60));
        if (hours > 0) return `${hours} hours ago`;
        const minutes = Math.floor(age / (1000 * 60));
        if (minutes > 0) return `${minutes} minutes ago`;
        const seconds = Math.floor(age / 1000);
        if (seconds > 10) return `${seconds} seconds ago`;
        return "Just now";
    }
    loadHistoryImages() {
        console.log(user.posts[0]);
        const imageContainer = document.getElementById("main-container-001");
        imageContainer.innerHTML = "";
        user.posts.forEach((post) => {
            let imageLink = post.images[0].url;
            imageContainer.innerHTML += `
                <div class="col-md-4">
                    <div class="card mb-4 box-shadow">
                        <img
                            class="card-img-top"
                            data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
                            alt="Thumbnail [100%x225]"
                            src="${imageLink}"
                            data-holder-rendered="true"
                            style="width: 100%; display: block"
                            id="img1"
                        />
                        <div class="card-body">
                            <div
                                class="d-flex justify-content-between align-items-center"
                            >
                                <div class="btn-group">
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-secondary"
                                        data-toggle="modal"
                                        data-target="${
                                            "#myModal" +
                                            post.images[0].__created
                                        }"
                                    >
                                        View
                                    </button>
                                    <div
                                        id="${
                                            "myModal" + post.images[0].__created
                                        }"
                                        class="modal fade"
                                        tabindex="-1"
                                        role="dialog"
                                        aria-labelledby="myModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-body">
                                                    <img
                                                        src="${imageLink}"
                                                        class="img-responsive"
                                                        style="width: 100%;"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-secondary"
                                        onclick="edit('${post._id}')"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <small class="text-muted">${this.getAge(
                                    post.images[0].__created
                                )}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        console.log(imageContainer.innerHTML);
    }
}

function edit(postId) {
    // console.log(postId);
    // console.log(user)
    const post = user.posts.find((post) => post._id === postId);

    user.currentPost = post;
    // store the current post in local Storage
    localStorage.setItem("currentPost", JSON.stringify(post));
    window.location.href = "http://localhost:4000/edit";
    console.log(user);
}

const imagebox = document.getElementById("image-box");
const crop_btn = document.getElementById("download-btn");
const input = document.getElementById("upload-file");
imagebox.innerHTML = `<img src="defaultEditImage.jpg" id="image" style="width:100%;">`;

input.addEventListener("change", () => {
    const img_data = input.files[0];
    // create a post
    handleCrop(img_data);
});

function handleCrop(img_data, save = true, filename = "default.jpg") {
    console.log(img_data);
    const formData = new FormData();
    if (save) formData.append("postImage", img_data);
    else {
        img_data.name = filename;
        formData.append("postImage", img_data);
    }

    if (save) user.createNewPost(formData);

    const url = URL.createObjectURL(img_data);

    imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%;">`;

    const image = document.getElementById("image");

    document.getElementById("image-box").style.display = "block";
    document.getElementById("download-btn").style.display = "block";

    const cropper = new Cropper(image, {
        autoCropArea: 1,
        viewMode: 1,
        scalable: false,
        zoomable: false,
        movable: false,
        minCropBoxWidth: 200,
        minCropBoxHeight: 200,
    });

    crop_btn.addEventListener("click", () => {
        cropper.getCroppedCanvas().toBlob((blob) => {
            let fileInputElement = document.getElementById("image-box");
            let file = new File([blob], img_data.name, {
                type: "image/*",
                lastModified: new Date().getTime(),
            });
            let container = new DataTransfer();
            container.items.add(file);
            fileInputElement.files = container.files;

            let e;
            const link = document.createElement("a");
            link.download = file.name;
            link.href = URL.createObjectURL(file);
            e = new MouseEvent("click");
            link.dispatchEvent(e);

            // add image to post
            const formData = new FormData();
            formData.append("postImage", file);

            user.addImageToPost(user.currentPost._id, formData);
        });
    });
}

async function handleCredentialResponse(googleUser) {
    user.handleCredentialResponse(googleUser);
    onLogin();
}

function onLogin() {
    if (user.isLogin) {
        console.log("hi");
        if (
            window.location.hash.substring(1) === "login" ||
            window.location.hash.substring(1) === "signup"
        )
            window.location.href = "http://localhost:4000/";
    } else {
        if (
            window.location.hash.substring(1) !== "login" &&
            window.location.hash.substring(1) !== "signup"
        )
            // window.location.href = "http://localhost:4000/login";
            console.log("Invalid credentials");
    }
}

async function login() {
    user.login();
    onLogin();
}

async function register() {
    user.signup();
    onLogin();
}

async function logout() {
    user.logout();
    onLogin();
    // clear local storage
    localStorage.clear();
}