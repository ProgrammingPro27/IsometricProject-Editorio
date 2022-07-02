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
    tileZ: 20,
    x: window.innerWidth / 2,
    y: window.innerHeight / 4,
    activateStroke: true,
    oldX: 0,
    oldY: 0,
    button: false,
    flatChunk: false,
    isActive: false,
    ind: false
};

function returnParameters() {
    return {
        flatCoords: Number(document.getElementById("quantity1").value),
        perlinCoords: Number(document.getElementById("quantity3").value),
        fieldValueGridSize: Number(document.getElementById("gridSize").value),
        fieldValueResolution: Number(document.getElementById("resolution").value),
        fieldValueGroundLayers: Number(document.getElementById("groundLayers").value),
        fieldValueHeightLimit: Number(document.getElementById("heightLimit").value)
    };
};

let chunk = new Chunk();

let perlin = new Perlin();
perlin.seed();

function updateMap(command) {
    try {
        let values = returnParameters();
        if (command == "c1") {
            gameObject.flatChunk = false;
            chunk.createFlatChunk(canvas, ctx, gameObject.tileW, gameObject.tileZ, window.innerWidth / 2, window.innerHeight / 4, values.flatCoords, values.flatCoords, "0,0");
        };
        if (command == "c2") {
            if (gameObject.flatChunk == true) {
                chunk.createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit);
            };
        };
        if (command == "c3") {
            gameObject.flatChunk = true;
            chunk.createFlatChunk(canvas, ctx, gameObject.tileW, gameObject.tileZ, window.innerWidth / 2, window.innerHeight / 4, values.perlinCoords, values.perlinCoords, "0,0").createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit);
        };
        gameObject.isActive = true
    } catch (err) {
        alert("Invalid Operation!\nMake sure every map option is included!");
    };
};

canvas.addEventListener("mousemove", mouseEvent, { passive: true });
canvas.addEventListener("mousedown", mouseEvent, { passive: true });
canvas.addEventListener("mouseup", mouseEvent, { passive: true });
canvas.addEventListener("mouseout", mouseEvent, { passive: true });
canvas.addEventListener("mousewheel", onmousewheel, false);
canvas.addEventListener("click", function () {
    if (gameObject.eventToPut) {
        gameObject.isActive = true;
    };
});

function mouseEvent(event) {
    if (event.type === "mousedown") { gameObject.button = true };
    if (event.type === "mouseup" || event.type === "mouseout") { gameObject.button = false };
    gameObject.oldX = gameObject.mouseCoordinates[0];
    gameObject.oldY = gameObject.mouseCoordinates[1];
    gameObject.mouseCoordinates[0] = event.offsetX;
    gameObject.mouseCoordinates[1] = event.offsetY;
    if (gameObject.button) { // pan
        view.pan({ x: gameObject.mouseCoordinates[0] - gameObject.oldX, y: gameObject.mouseCoordinates[1] - gameObject.oldY });
        gameObject.isActive = true;
    };
};
view.setContext(ctx);

function onmousewheel(event) {
    let e = window.event || event;
    let x = e.offsetX;
    let y = e.offsetY;
    const delta = e.type === "mousewheel" ? e.wheelDelta : -e.detail;
    if (delta > 0) {
        view.scaleAt({ x, y }, 1.1)
    }
    else {
        view.scaleAt({ x, y }, 1 / 1.1)
    }
    gameObject.isActive = true
    e.preventDefault();
};

let size = 200;
let img = new Image();
img.src = "./newLogo.png";
let flag = true;
function introAnimation() {
    if (flag == true) {
        requestAnimationFrame(introAnimation);
        if (size <= 500) {
            ctx.reset();
            ctx.drawImage(img, (width / 2) - size / 2, (height / 2) - size / 2, size, size);
            size += 4;
        } else {
            document.getElementById('controlPanelButton').style.display = "block";
            document.getElementById('controlWindowButton').style.display = "block";
            document.getElementById("quantity3").dispatchEvent(new Event("input"));
            flag = false;
            render();
        };
    };
};

function draw() {
    gameObject.activateStroke = gameObject.ind;
    ctx.reset();
    view.apply();
    chunk.loadChunk(`0,0`, gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.activateStroke, gameObject.key);
};

function render() {
    requestAnimationFrame(render);
    if (gameObject.isActive == true) {
        gameObject.ind = false;
        draw();
        window.clearTimeout(gameObject.isScrolling);
        gameObject.ind = true
        gameObject.isScrolling = setTimeout(draw, 500);
        gameObject.isActive = false
    };
};

introAnimation();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameObject.isActive = true
});
window.addEventListener("keypress", function (e) {
    gameObject.key = e.code;
});
window.addEventListener("keydown", function (e) {
    if (gameObject.flatChunk == true) {
        let action = {
            "KeyW": ["flying", "-", "flying2", "-"],
            "KeyS": ["flying", "+", "flying2", "+"],
            "KeyA": ["flying", "+", "flying2", "-"],
            "KeyD": ["flying", "-", "flying2", "+"]
        };
        if (action[e.code]) {
            let values = returnParameters();
            chunk.createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit, ...action[e.code]);
            gameObject.isActive = true
        };
    };
});
