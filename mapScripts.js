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
    oldX: 0,
    oldY: 0,
    button: false,
    flatChunk: false
};

function updateStroke() {
    gameObject.activateStroke = false;
    window.clearTimeout(gameObject.isScrolling);
    gameObject.isScrolling = setTimeout(function () {
        gameObject.activateStroke = true;
    }, 500);
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
        if (command === "c1") {
            gameObject.flatChunk = false
            chunk.createFlatChunk(canvas, ctx, gameObject.tileW, gameObject.tileZ, window.innerWidth / 2, window.innerHeight / 4, values.flatCoords, values.flatCoords, "0,0")
        } else {
            gameObject.flatChunk = true
            chunk.createFlatChunk(canvas, ctx, gameObject.tileW, gameObject.tileZ, window.innerWidth / 2, window.innerHeight / 4, values.perlinCoords, values.perlinCoords, "0,0").createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit)
        }
        updateStroke();
    } catch (err) {
        alert("Invalid Operation!\nMake sure every map option is included!");
    };
};

canvas.addEventListener("mousemove", mouseEvent, { passive: true });
canvas.addEventListener("mousedown", mouseEvent, { passive: true });
canvas.addEventListener("mouseup", mouseEvent, { passive: true });
canvas.addEventListener("mouseout", mouseEvent, { passive: true });
canvas.addEventListener("mousewheel", onmousewheel, false);

function mouseEvent(event) {
    if (event.type === "mousedown") { gameObject.button = true }
    if (event.type === "mouseup" || event.type === "mouseout") { gameObject.button = false }
    gameObject.oldX = gameObject.mouseCoordinates[0];
    gameObject.oldY = gameObject.mouseCoordinates[1];
    gameObject.mouseCoordinates[0] = event.offsetX;
    gameObject.mouseCoordinates[1] = event.offsetY;
    if (gameObject.button) { // pan
        view.pan({ x: gameObject.mouseCoordinates[0] - gameObject.oldX, y: gameObject.mouseCoordinates[1] - gameObject.oldY });
        updateStroke();
    }
}
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
    updateStroke();
    e.preventDefault();
}

function updatePosition(values, num, val, num1, val2) {
    chunk.createFlatChunk(canvas, ctx, gameObject.tileW, gameObject.tileZ, window.innerWidth / 2, window.innerHeight / 4, values.perlinCoords, values.perlinCoords, "0,0").createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit, num, val, num1, val2);
    gameObject.activateStroke = false;
}


let opacity = 0;
let size = 200;
let img = new Image()
img.src = "./newLogo.png"

function introAnimation() {
    if (opacity < 1) {
        if (size <= 500) {
            opacity += 0.01
            ctx.drawImage(img, (width / 2) - size / 2, (height / 2) - size / 2, size, size);
            size += 3
        }
        ctx.globalAlpha = opacity;
        if (opacity == 1.0000000000000007) {
            document.getElementById('controlPanelButton').style.display = "block"
            document.getElementById('controlWindowButton').style.display = "block"
            document.getElementById("quantity3").dispatchEvent(new Event("input"))
            ctx.globalAlpha = 1;
        }
    }
}

function render() {
    requestAnimationFrame(render);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    view.apply();

    introAnimation()

    canvas.style.cursor = "default";
    chunk.loadChunk(`0,0`, gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.activateStroke, gameObject.key);
};

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener("keydown", function (e) {
    if (gameObject.flatChunk === true) {
        let values = returnParameters();
        switch (e.code) {
            case "KeyW":
                updatePosition(values, "flying", "-", "flying2", "-");
                ; break;
            case "KeyS":
                updatePosition(values, "flying", "+", "flying2", "+");
                ; break;
            case "KeyA":
                updatePosition(values, "flying", "+", "flying2", "-");
                ; break;
            case "KeyD":
                updatePosition(values, "flying", "-", "flying2", "+");
                ; break;
        };
        gameObject.key = e.code;
        updateStroke();
    };
});
