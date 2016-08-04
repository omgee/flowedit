var view = (function(){
    var id = document.getElementById('view');
    // Magic
    id.width = window.innerWidth;
    id.height = window.innerHeight;
    // Magic
    var x, y;
    var oX = 0;
    var oY = 0;
    var grab = false;
    var getMousePosition = function(event) {
        x = event.offsetX;
        y = event.offsetY;
    }
    id.onmousemove = getMousePosition;
    var click = function(event) {

    }
    var down = function(event) {
        x = event.offsetX;
        y = event.offsetY;
        grab = true;
    }
    var move = function(event) {
        if (!grab) return;
        oX = x - event.offsetX;
        oY = y - event.offsetY;
        console.log(oX + " " + oY);
    }
    var up = function(event) {
        grab = false;
    }
    id.onmousemove = move;
    id.onmousedown = down;
    id.onmouseup = up;
    id.onclick = click;
    return {
        oX: oX,
        oY: oY,
        w: id.width,
        h: id.height,
        layer: id.getContext('2d')
    }
})();
var object = (function(){
    var grid = function(size) {
        view.layer.fillStyle = "#C0C0C0";
        for (var i = 0; i < view.w / size; i++) {
            view.layer.fillRect((i * size) + view.oX, view.oY, 1, view.h);
        }
        for (var k = 0; k < view.h / size; k++) {
            view.layer.fillRect(view.oX, (k * size) + view.oY, view.w, 1);
        }
    }
    return {
        grid: grid
    }
})();
var render = (function(){
    var last = Date.now(), fps = 0;
    var init = function() {
        frame();
    }
    var frame = function() {
        view.layer.clearRect(0, 0, view.w, view.h);
        object.grid(32);
        delta = (new Date().getTime() - last) / 1000;
        last = Date.now();
        fps = 1 / delta;
        requestAnimationFrame(frame);
    }
    var showFps = function() {
        console.log(Math.floor(fps));
    }
    setInterval(showFps, 1000);
    return {
        init: init
    }
})();
render.init();
