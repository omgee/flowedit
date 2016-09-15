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

    delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();
    fps = 1 / delta;

    requestAnimationFrame(render);
}

// Grid draw function (block size in px)
function drawGrid(size) {
    context.fillStyle = "silver";

    for (var i = 0; i <= width / size; i++) {
        context.fillRect(i * size + (x % size), 0, 1, height);
    }

    for (var i = 0; i <= height / size; i++) {
        context.fillRect(0, i * size + (y % size), width, 1);
    }
}

// Grab offset
var grab = false;
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
}

function move(e) {
    if (!grab) return;

    x = tmpX + e.clientX - lastX;
    y = tmpY + e.clientY - lastY;
}

function up(e) {
    grab = false;
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


// Start render
render();
