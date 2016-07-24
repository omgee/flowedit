var body = document.getElementsByTagName('body')[0];
var objects = (function(){
    var objects = []
    var add = function(type, x, y, text) {
        objects.push([type, x, y, text]);
        var div = document.createElement('div');
        div.className = 'block';
        div.style.top = y + 'px';
        div.style.left = x + 'px';
        div.innerHTML = text;
        div.id = "block" + objects.length;
        body.appendChild(div);
        // TODO: Add events support
    }
    var remove = function(id) {
        body.removeChild(document.getElementById('block' + id));
    }
    return {
        add: add,
        remove: remove,
        move: undefined
    }
})();
