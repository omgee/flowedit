// Initialization
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var fps = document.getElementById('fps');
var width = window.innerWidth;
var height = window.innerHeight;

// Change Canvas size
canvas.width = width;
canvas.height = height;

// Rendering function
function render() {
    if (!lastTime) {
        lastTime = Date.now();
        fps = 0;
    }

    canvas.width = canvas.width;

    drawGrid(32);
    drawObjects();

    delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();
    fps = 1 / delta;

    requestAnimationFrame(render);
}

// Grid draw function (block size in px)
function drawGrid(size) {
    context.beginPath();

    for (var i = 0; i <= width / size + 1; i++) {
        var tmp = i * size + 0.5 + (x % size);
        context.moveTo(tmp, 0);
        context.lineTo(tmp, height);

    }

    for (var i = 0; i <= height / size + 1; i++) {
        var tmp = i * size + 0.5 + (y % size);
        context.moveTo(0, tmp);
        context.lineTo(width, tmp);
    }

    context.stroke();
}

// Grab offset
var grab = false;
var grabObject = false;
var x = 0;
var y = 0;
var lastX = 0;
var lastY = 0;
var tmpX = 0;
var tmpY = 0;

// Grab functions
function down(e) {
    grab = true;
    lastX = e.clientX;
    lastY = e.clientY;
    tmpX = x;
    tmpY = y;
    grabObject = isObject();
}

function move(e) {
    if (!grab) return;

    x = tmpX + e.clientX - lastX;
    y = tmpY + e.clientY - lastY;
}

function up(e) {
    grab = false;
    grabObject = false;
}

// Assign grab functions
canvas.onmousedown = down;
canvas.onmousemove = move;
canvas.onmouseup = up;

// Calculate and show fps (Rendering function)
var lastTime, fps, delta;

function showFps() {
    document.getElementById('fps').innerHTML = Math.floor(fps);
}

setInterval(showFps, 100);

// Objects initialization
var objects = [];

// Add object
function addObject(type, x, y, w, h) {
    objects.push([type, x, y, w, h, prompt("Введите текст")]);
}

// Delete last
function deleteObject() {
    objects.pop();
}

// Simple object
function drawObject(type, x, y, w, h, text) {
    context.beginPath();

    switch(type) {
        case 0: // Box
            context.moveTo(x + this.x, y + this.y);
            context.lineTo(x + this.x + w, y + this.y);
            context.lineTo(x + this.x + w, y + this.y + h);
            context.lineTo(x + this.x, y + this.y + h);
            context.lineTo(x + this.x, y + this.y);
            break;
        case 1: // Ромб
            context.moveTo(x, y + h / 2);
            context.lineTo(x + w / 2, y);
            context.lineTo(x + w, y + h / 2);
            context.lineTo(x + w / 2, y + h);
            context.closePath();
            break;
        case 2: // Insert
            context.moveTo(x, y + h);
            context.lineTo(x + w - 64, y + h);
            context.lineTo(x + w, y);
            context.lineTo(x + 64, y);
            context.closePath();
            break;
    }

    context.lineWidth = 3;

    context.fillStyle = "#fff";
    context.fill();
    context.stroke();
    context.fillStyle = "black";
    context.font = "32px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, x + w / 2 + this.x, y + h / 2 + this.y);
}

// Draw objects
function drawObjects() {
    objects.forEach(function(e) {
        var type = e[0],
               x = e[1],
               y = e[2],
               w = e[3],
               h = e[4],
            text = e[5];
        drawObject(type, x, y, w, h, text);
    });
}

// Start render
render();
