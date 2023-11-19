class Stack {
    constructor() {
        this.array = [];
    }
    push(element) {
        this.array.push(element);
    }
    pop() {
        if (!this.isEmpty()) return this.array.pop();
        else return null;
    }
    top() {
        if (!this.isEmpty()) return this.array[this.array.length - 1];
        else return null;
    }
    isEmpty() {
        return this.array.length === 0;
    }
}

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
const movePointWithMouse = (point) => {
    document.onmousemove = (ev) => {
        glue(point, ev);
    };
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
    console.log(index);
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
