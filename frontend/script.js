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
