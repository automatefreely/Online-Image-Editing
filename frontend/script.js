const imagebox = document.getElementById("image-box");
const crop_btn = document.getElementById("download-btn");
const input = document.getElementById("upload-file");
imagebox.innerHTML = `<img src="defaultEditImage.jpg" id="image" style="width:100%;">`;

input.addEventListener("change", () => {
    const img_data = input.files[0];
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
        });
    });
});

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

async function handleCredentialResponse(googleUser) {
    console.log("googleUser", googleUser);
    console.log("googleUser", parseJwt(googleUser.credential));
    // send this credential to backend

    const URL = "http://localhost:4000/api/user/signin/google";
    const data = { token: googleUser.credential };
    try {
        const response =await  fetch(URL, {
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
            window.location.href = "http://localhost:4000/dashboard";
        }
    } catch (error) {
        console.log(error)
    }
}

async function login() {
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
        if(result.result) {
            window.location.href = "http://localhost:4000/dashboard";
        }
    } catch (error) {
        console.log(error);
    }
}
