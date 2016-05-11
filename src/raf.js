var root = require('./detect').root;

root.requestAnimationFrame = (function() {
    return root.webkitRequestAnimationFrame ||
        root.requestAnimationFrame ||
        root.mozRequestAnimationFrame ||
        root.oRequestAnimationFrame ||
        root.msRequestAnimationFrame ||
        function(callback/*, element*/){
            return root.setTimeout(callback, 1000 / 60);
        };
})();
