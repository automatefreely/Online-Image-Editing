const drawRect = (autoPlayBtn, text, ctx) => {
    const x = autoPlayBtn.x;
    const y = autoPlayBtn.y;
    const width = autoPlayBtn.width;
    const height = autoPlayBtn.height;
    // console.log(x, y, width, height);
    ctx.beginPath();
    ctx.font = "20px Georgia";

    ctx.fillRect(x, y, width, height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "yellow";
    ctx.fillText(text, x + width / 2, y + height / 2);
    ctx.fillStyle = "black";
    ctx.stroke();
};

const getRextCenter = (rect) => {
    const x = autoPlayBtn.x;
    const y = autoPlayBtn.y;
    const width = autoPlayBtn.width;
    const height = autoPlayBtn.height;
    return { x: x + width / 2, y: y + height / 2 };
};

// glue p1 with p2
const glue = (p1, p2) => {
    p1.x = p2.x;
    p1.y = p2.y;
};

const movePointWithMouse = (point, canvas) => {
    const ctx = canvas.getContext("2d");

    const getCanvasRelativePosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        return { x: offsetX, y: offsetY };
    };

    const handleMouseMove = (ev) => {
        const rect = canvas.getBoundingClientRect();
        const offsetX = rect.left - canvas.offsetLeft;
        const offsetY = rect.top - canvas.offsetTop;
        const mousePos = getCanvasRelativePosition(ev);
        point.x = mousePos.x - offsetX;
        point.y = mousePos.y - offsetY;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Handle window resize if canvas size changes
};
const handleResize = () => {
    canvas.width = window.innerWidth * 0.8; // Adjust canvas width
    canvas.height = window.innerHeight * 0.6; // Adjust canvas height
};

function findDistance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function nearestPoint(point, fixed_points) {
    let a = 10000000;
    let index = 0;

    let nearest_point = fixed_points[0];
    for (let i = 0; i < fixed_points.length; i++) {
        const Distance = findDistance(point, fixed_points[i]);
        if (Distance < a) {
            a = Distance;
            nearest_point = fixed_points[i];
            index = i;
        }
    }
    return [nearest_point, index];
}

const drawPoint = (point, ctx) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.stroke();
};

function remover(array, element) {
    let index = null;
    for (let i = 0; i < array.length; i++) {
        if ((array[i].index = element.index)) {
            index = i;
        }
    }
    // console.log(index);
    return array.splice(index, 1);
}

function pointInRegion(point, region, ctx) {
    const padding = region.padding ? region.padding : 0;
    const x = region.x - padding;
    const y = region.y - padding;
    const width = region.width + padding * 2 * region.length;
    const height = region.height + padding * 2;

    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.rect(x, y, width, height);
        ctx.stroke();
    }

    return (
        x < point.x &&
        point.x < x + width &&
        y < point.y &&
        point.y < y + height
    );
}

function pointInRegion2(point, region) {
    const padding = region.padding ? region.padding : 0;
    const x = region.x - padding;
    const y = region.y + padding;
    const height =
        (region.length + 1) * region.symbolProps.height +
        padding * 2 * (region.length + 1);
    const width = region.symbolProps.width + padding * 2;
    return (
        x < point.x &&
        point.x < x + width &&
        y > point.y &&
        point.y > y - height
    );
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

const canvas = document.getElementById("canvas");
// get the starting position of canvas
const canvasRect = canvas.getBoundingClientRect();
window.addEventListener("resize", handleResize);

// Initial setup
handleResize();
const canvasX = canvasRect.x;
const canvasY = canvasRect.y;
// console.log(canvasX, canvasY);
var ctx = canvas.getContext("2d");
var img = new Image();

let fileName = "";

const uploadBtn = document.getElementById("upload-file");
const downloadBtn = document.getElementById("download-btn");

// Add event listener to uploadBtn when uploaded file is selected by user store it in image and display in canvas and change canvas size to image size
uploadBtn.addEventListener("change", function () {
    // Get file
    const file = document.querySelector("#upload-file").files[0];
    // Initialize FileReader API
    const reader = new FileReader();

    // Check for file
    if (file) {
        // Set file name
        fileName = file.name;
        // Read data as URL
        reader.readAsDataURL(file);
    }

    // Add image to canvas
    reader.addEventListener(
        "load",
        function () {
            // Set image src
            img.src = reader.result;
            // console.log(img.src);
            // On image load add to canvas
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
            };
        },
        false
    );
});

// Download Event
downloadBtn.addEventListener("click", function () {
    // Get ext
    const fileExtension = fileName.slice(-4);

    // Init new filename
    let newFilename;

    // Check image type
    if (fileExtension === ".jpg" || fileExtension === ".png") {
        // new filename
        newFilename =
            fileName.substring(0, fileName.length - 4) + "-edited.jpg";
    }

    // Call download
    download(canvas, newFilename);
});

// Download
function download(canvas, filename) {
    // Init event
    let e;
    // Create link
    const link = document.createElement("a");

    // Set props
    link.download = filename;
    link.href = canvas.toDataURL("image/jpeg", 0.8);
    // New mouse event
    e = new MouseEvent("click");
    // Dispatch event
    link.dispatchEvent(e);
}
