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
    drawLines();
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

    context.strokeStyle = "silver";
    context.stroke();
}

// Grab offset
var grab = false;
var grabObject = false;
var add = false;
var addCount = 0;
var x = 0;
var y = 0;
var lastX = 0;
var lastY = 0;
var tmpX = 0;
var tmpY = 0;
var oX = 0;
var oY = 0;

// Grab functions
var s;
var f;
function down(e) {
    grab = true;
    lastX = e.clientX;
    lastY = e.clientY;
    tmpX = x;
    tmpY = y;
    grabObject = isObject(lastX, lastY);
    oX = objects[currentObject][6];
    oY = objects[currentObject][7];
    if (add) {
        if (addCount == 0 && isObject(lastX, lastY)) {
            f = currentObject;
        }
        else if (addCount == 1 && isObject(lastX, lastY)) {
            s = currentObject;
        }
        addCount++;
        if (addCount == 2) {
            addCount = 0;
            add = false;
            console.log(s, f);
            lines.push([f, s]);
        }
    }
}

function move(e) {
    if (!grab) return;
    if (grabObject) {
        moveObject(e.clientX - lastX, e.clientY - lastY, oX, oY);
        return;
    }

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
var lines = [];
var currentObject;

//
function drawLines() {
    context.beginPath();

    lines.forEach(function(e) {
        var first = {
            x: objects[e[0]][1] + objects[e[0]][3] / 2 + this.x + objects[e[0]][6],
            y: objects[e[0]][2] + objects[e[0]][4] / 2 + this.y + objects[e[0]][7]
        };
        var second = {
            x: objects[e[1]][1] + objects[e[1]][3] / 2 + this.x + objects[e[1]][6],
            y: objects[e[1]][2] + objects[e[1]][4] / 2 + this.y + objects[e[1]][7]
        };
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
    });

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();
}

// Draw single line
function drawLine(x1, y1, x2, y2) {
    context.beginPath();

    context.moveTo(x1, y1);
    context.lineTo(x2, y2);

    context.stroke();
}

// Add object
function addObject(type, x, y, w, h) {
    context.font = "32px monospace";
    var text = prompt("Введите текст");
    w = context.measureText(text).width + 32;
    objects.push([type, x, y, w, h, text, 0, 0]);
}

// Delete last
function deleteObject() {
    objects.pop();
}

// Simple object
function drawObject(type, x, y, w, h, text, oX, oY) {
    context.beginPath();
    x += oX + this.x;
    y += oY + this.y;

    switch(type) {
        case 0: // Box
            context.moveTo(x, y);
            context.lineTo(x + w, y);
            context.lineTo(x + w, y + h);
            context.lineTo(x, y + h);
            context.lineTo(x, y);
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
            context.lineTo(x + w - 32, y + h);
            context.lineTo(x + w, y);
            context.lineTo(x + 32, y);
            context.closePath();
            break;
    }

    context.lineWidth = 2;

    context.fillStyle = "#fff";
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
    context.fillStyle = "black";
    context.font = "16px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, x + w / 2, y + h / 2);
}

// Draw objects
function drawObjects() {
    objects.forEach(function(e) {
        var type = e[0],
               x = e[1],
               y = e[2],
               w = e[3],
               h = e[4],
            text = e[5],
              oX = e[6],
              oY = e[7];
        drawObject(type, x, y, w, h, text, oX, oY);
    });
}

// Is object
function isObject(mX, mY) {
    for (var i = 0; i < objects.length; i++) {
        var x = objects[i][1] + this.x + objects[i][6],
            y = objects[i][2] + this.y + objects[i][7],
            w = objects[i][3],
            h = objects[i][4];
        if (mX >= x && mX <= x + w && mY >= y && mY <= y + h) {
            currentObject = i;
            return true;
        }
    }
}

// Move object
function moveObject(x, y, oX, oY) {
    objects[currentObject][6] = x + oX;
    objects[currentObject][7] = y + oY;
}

// Add line
function addLine() {
    add = true;
}

// Start render
render();
