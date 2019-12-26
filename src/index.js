var world = 'world';
var hello = function (word) {
    if (word === void 0) { word = world; }
    return "Hello " + world + "!";
};
console.log(hello());
