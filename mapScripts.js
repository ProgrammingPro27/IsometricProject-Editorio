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
    activateStroke: true
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

let perlin = new Perlin();
perlin.seed();

function updateMap(command) {
    try {
        let values = {
            flatCoords: Number(document.getElementById("quantity1").value),
            perlinCoords: Number(document.getElementById("quantity3").value),
            fieldValueGridSize: Number(document.getElementById("gridSize").value),
            fieldValueResolution: Number(document.getElementById("resolution").value),
            fieldValueGroundLayers: Number(document.getElementById("groundLayers").value),
            fieldValueHeightLimit: Number(document.getElementById("heightLimit").value),
        };
        let comb = {
            c1: `chunk.createFlatChunk(canvas,ctx,gameObject.tileW,gameObject.tileZ,window.innerWidth / 2, window.innerHeight / 4, values.flatCoords,values.flatCoords,"0,0")`,
            c2: `chunk.createFlatChunk(canvas,ctx,gameObject.tileW,gameObject.tileZ,window.innerWidth / 2, window.innerHeight / 4, values.perlinCoords,values.perlinCoords,"0,0").createPerlinChunk(values.perlinCoords,perlin,"0,0",values.fieldValueGridSize,values.fieldValueResolution,values.fieldValueGroundLayers,values.fieldValueHeightLimit)`
        };
        eval(comb[command]);
        updateStroke();
    } catch (err) {
        alert("Invalid Operation!\nMake sure every map option is included!");
    };
};

canvas.addEventListener("mousewheel", onmousewheel, false);

const view = (() => {
    const matrix = [1, 0, 0, 1, 0, 0];
    var m = matrix;
    var scale = 1;
    var ctx;
    const pos = { x: 0, y: 0 };
    var dirty = true;
    const API = {
        setContext(_ctx) { ctx = _ctx; dirty = true },
        apply() {
            if (dirty) { this.update() }
            ctx.setTransform(...m)
        },
        getScale() { return scale },
        getPosition() { return pos },
        isDirty() { return dirty },
        update() {
            dirty = false;
            m[3] = m[0] = scale;
            m[2] = m[1] = 0;
            m[4] = pos.x;
            m[5] = pos.y;
        },
        scaleAt(at, amount) {
            if (dirty) { this.update() }
            scale *= amount;
            pos.x = at.x - (at.x - pos.x) * amount;
            pos.y = at.y - (at.y - pos.y) * amount;
            dirty = true;
        },
    };
    return API;
})();

view.setContext(ctx);

function onmousewheel(event) {
    var e = window.event || event;
    var x = e.offsetX;
    var y = e.offsetY;
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

function updatePosition(values, num, val) {
    chunk.createFlatChunk(canvas,ctx,gameObject.tileW,gameObject.tileZ,window.innerWidth / 2, window.innerHeight / 4, values.perlinCoords,values.perlinCoords,"0,0").createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit, num, val);
    chunk.createFlatChunk(canvas,ctx,gameObject.tileW,gameObject.tileZ,window.innerWidth / 2, window.innerHeight / 4, values.perlinCoords,values.perlinCoords,"0,0").createPerlinChunk(values.perlinCoords, perlin, "0,0", values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers, values.fieldValueHeightLimit, num, val);
    gameObject.activateStroke = false;
}

function render() {
    requestAnimationFrame(render);
    // ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    view.apply();
    // ctx.restore();
    canvas.style.cursor = "default";
    chunk.loadChunk(`0,0`, gameObject.mouseCoordinates[0], gameObject.mouseCoordinates[1], gameObject.eventToPut, gameObject.activateStroke, gameObject.key);
};

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener("keydown", function (e) {
    let values = {
        flatCoords: Number(document.getElementById("quantity1").value),
        perlinCoords: Number(document.getElementById("quantity3").value),
        fieldValueGridSize: Number(document.getElementById("gridSize").value),
        fieldValueResolution: Number(document.getElementById("resolution").value),
        fieldValueGroundLayers: Number(document.getElementById("groundLayers").value),
        fieldValueHeightLimit: Number(document.getElementById("heightLimit").value),
    };
    switch (e.code) {
        case "KeyW":
            updatePosition(values, "flying", "-");
            updatePosition(values, "flying2", "-");
                ; break;
        case "KeyS":
            updatePosition(values, "flying", "+");
            updatePosition(values, "flying2", "+");
            ; break;
        case "KeyA":
            updatePosition(values, "flying", "+");
            updatePosition(values, "flying2", "-");
            ; break;
        case "KeyD":
            updatePosition(values, "flying", "-");
            updatePosition(values, "flying2", "+");
            ; break;
    };
    gameObject.key = e.code;
    updateStroke();
});
