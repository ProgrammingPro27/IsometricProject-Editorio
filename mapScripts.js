let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let gameObject = {
    key: undefined,
    eventToPut: undefined,
    isScrolling: undefined,
    mouseCoordinates: [],
    tileW: 50,
    tileH: 50,
    tileZ: 20,
    x: window.innerWidth / 2,
    y: window.innerHeight / 4,
    activateStroke: true,
    map: []
};

canvas.addEventListener("mousemove", function (e) {
    gameObject.mouseCoordinates[0] = e.offsetX;
    gameObject.mouseCoordinates[1] = e.offsetY;
});

function updateStroke() {
    gameObject.activateStroke = false;
    window.clearTimeout(gameObject.isScrolling);
    gameObject.isScrolling = setTimeout(function () {
        gameObject.activateStroke = true;
    }, 500);
};

let chunk = new Chunk();

function updateMap(command) {
    try {
        let values = {
            flatCoords: Number(document.getElementById("quantity1").value),
            perlinCoords: Number(document.getElementById("quantity3").value),
            fieldValueGridSize: Number(document.getElementById("gridSize").value),
            fieldValueResolution: Number(document.getElementById("resolution").value),
            fieldValueGroundLayers: Number(document.getElementById("groundLayers").value),
        };
        let comb = {
            c1: `chunk.createFlatChunk(values.flatCoords,values.flatCoords,"0,0")`,
            c2: `chunk.createFlatChunk(values.perlinCoords,values.perlinCoords,"0,0").createPerlinChunk("0,0",values.fieldValueGridSize,values.fieldValueResolution,values.fieldValueGroundLayers)`,
        };
        eval(comb[command]);
        updateStroke();
    } catch (err) {
        alert("Invalid Operation!\nMake sure every map option is included!");
    };
};

function render() {
    requestAnimationFrame(render);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    canvas.style.cursor = "default";
    chunk.loadChunk("0,0", gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.activateStroke, gameObject.key);
};

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener("keypress", function (e) {
    switch (e.code) {
        case "KeyW": ctx.translate(0, -10); break;
        case "KeyS": ctx.translate(0, 10); break;
        case "KeyA": ctx.translate(-10, 0); break;
        case "KeyD": ctx.translate(10, 0); break;
    };
    gameObject.key = e.code;
    updateStroke();
});

function zoom(clicks) {
    let scaleFactor = 1.1;
    ctx.translate(gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1]);
    let factor = Math.pow(scaleFactor, clicks);
    ctx.scale(factor, factor);
    ctx.translate(-gameObject.mouseCoordinates[0], -gameObject.mouseCoordinates[1]);
};

let handleScroll = function (evt) {
    let delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
    if (delta) {
        zoom(delta);
    };
    updateStroke();
    return evt.preventDefault() && false;
};

canvas.addEventListener('mousewheel', handleScroll, false);
