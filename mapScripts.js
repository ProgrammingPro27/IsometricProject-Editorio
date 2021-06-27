let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let gameObject = {
    key: undefined,
    eventToPut: undefined,
    isScrolling:undefined,
    rows: 0,
    cols: 0,
    mouseCoordinates: [],
    tileW: 50,
    tileH: 50,
    tileZ: 20,
    leftColor: "#808080",
    rightColor: "#A9A9A9",
    topColor: "#909090",
    operations: ["removeTile", "increaseSize", "addUpperLevel", "colorise"],
    x: window.innerWidth / 2,
    y: window.innerHeight / 4,
    activateStroke:true,
}

let map = [];

function Iso3d(x, y, wx, wy, h, flag, level) {
    this.x = x;
    this.y = y;
    this.wx = wx;
    this.wy = wy;
    this.h = h;
    this.flag = flag;
    this.leftColor = gameObject.leftColor;
    this.rightColor = gameObject.rightColor;
    this.topColor = gameObject.topColor;
    this.level = level;
    this.isVisible = true;
    this.cellCoordinate = { row: null, col: null };
}

Iso3d.prototype.drawCube = function () {
    let cubeSide1 = {
        moveTo: [this.x, this.y],
        sides: [[this.x - this.wx, this.y - this.wx * 0.5], [this.x - this.wx, this.y - this.h - this.wx * 0.5], [this.x, this.y - this.h * 1]],
        color: this.leftColor
    }
    let cubeSide2 = {
        moveTo: [this.x, this.y],
        sides: [[this.x + this.wy, this.y - this.wy * 0.5], [this.x + this.wy, this.y - this.h - this.wy * 0.5], [this.x, this.y - this.h * 1]],
        color: this.rightColor
    }
    let cubeSide3 = {
        moveTo: [this.x, this.y - this.h],
        sides: [[this.x - this.wx, this.y - this.h - this.wx * 0.5], [this.x - this.wx + this.wy, this.y - this.h - (this.wx * 0.5 + this.wy * 0.5)], [this.x + this.wy, this.y - this.h - this.wy * 0.5]],
        color: this.topColor
    }//top
    let sides = [cubeSide1, cubeSide2, cubeSide3];

    for (let i = 0; i < sides.length; i++) {
        ctx.beginPath();
        ctx.moveTo(...sides[i].moveTo);
        for (let j of sides[i].sides) {
            ctx.lineTo(...j);
        }
        ctx.closePath();
        ctx.fillStyle = sides[i].color;
        ctx.fill();
        if(gameObject.activateStroke === true){
            ctx.stroke();
        }
    }
    return this;
}
Iso3d.prototype.collision = function () {
    let mouseX = gameObject.mouseCoordinates[0];
    let mouseY = gameObject.mouseCoordinates[1];

    if (ctx.isPointInPath(mouseX, mouseY)) {
        this.flag = true;
        for (let i = 0; i < map.length; i++) {
            let index = map[i].indexOf(this)
            if (index !== -1) {
                this.cellCoordinate.row = i;
                this.cellCoordinate.col = index;
            }
        }
        canvas.style.cursor = "pointer";
        return this;
    }
    else {
        this.flag = false;
        this.cellCoordinate.row = null;
        this.cellCoordinate.col = null;
        return this;
    }

}
Iso3d.prototype.increaseSize = function () {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            if (value.flag === true) {
                value.h += 5;
            }
        }
    }
    return this;
}
Iso3d.prototype.removeTile = function () {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            if (value.flag === true) {
                let i = value.cellCoordinate.row;
                let j = value.cellCoordinate.col;
                if (i !== null && j !== null) {
                    map[i] = map[i].filter(item => item !== value);
                }
            }
        }
    }
    return this;
}
Iso3d.prototype.addUpperLevel = function () {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            if (value.flag === true) {
                let i = value.cellCoordinate.row;
                let j = value.cellCoordinate.col;
                let isoCube = new Iso3d()
                isoCube.x = map[i][j].x;
                isoCube.y = map[i][j].y - map[i][j].h;
                isoCube.wx = gameObject.tileW;
                isoCube.wy = gameObject.tileH;
                isoCube.h = gameObject.tileZ;
                if (i !== null && j !== null) {
                    isoCube.level = 1;
                    map[i].push(isoCube.drawCube());
                    map[i] = map[i].sort((a, b) => { return a.x - b.x || b.y - a.y });
                }
            }
        }
    }
    return this;
}
Iso3d.prototype.colorise = function () {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            if (gameObject.key) {
                switch (gameObject.key) {
                    case "1"://snow Block
                        value.leftColor = "#FFFCFC";
                        value.rightColor = "#FFFBFB";
                        value.topColor = "#FFFAFA"; break;
                    case "2"://water Block
                        value.leftColor = "#2389da";
                        value.rightColor = "#2389da";
                        value.topColor = "#2389da"; break;
                    case "3"://stone Block 
                        value.leftColor = "#4D525B";
                        value.rightColor = "#787F8E";
                        value.topColor = "#606672"; break;
                    case "4"://sand Block 
                        value.leftColor = "#cabc91";
                        value.rightColor = "#dbd1b4";
                        value.topColor = "#d3c7a2"; break;
                    case "5"://grass Block 
                        value.leftColor = "#8B4513";
                        value.rightColor = "#A0522D";
                        value.topColor = "#6B8E23"; break;
                }
            }

        }
    }
}

function drawIsometricTileMap(mapX, mapY) {
    let oriX = window.innerWidth / 2;
    let oriY = window.innerHeight / 4;
    for (let i = 0; i < mapX; i++) {
        let mapRow = [];
        for (let j = 0; j < mapY; j++) {
            let isoCube = new Iso3d();
            isoCube.x = gameObject.x;
            isoCube.y = gameObject.y;
            isoCube.wx = gameObject.tileW;
            isoCube.wy = gameObject.tileH;
            isoCube.h = gameObject.tileZ;
            isoCube.level = 0;
            gameObject.x += gameObject.tileW;
            gameObject.y += gameObject.tileH / 2;
            mapRow.push(isoCube);
        }
        oriX -= gameObject.tileW;
        oriY += gameObject.tileH / 2;
        gameObject.x = oriX;
        gameObject.y = oriY;
        map.push(mapRow);
    }
}

canvas.addEventListener("mousemove", function (e) {
    gameObject.mouseCoordinates[0] = e.offsetX;
    gameObject.mouseCoordinates[1] = e.offsetY;
})

function showValX(xx) {
    let downCoord = document.getElementById("quantity2");
    updateCoordsMap();
    drawIsometricTileMap(Number(xx.value), Number(downCoord.value));
}

function showValY(yy) {
    let upCoord = document.getElementById("quantity1");
    updateCoordsMap();
    drawIsometricTileMap(Number(upCoord.value), Number(yy.value));
}

function updateCoordsMap() {
    let maps = [];
    for (let i = 0; i < gameObject.rows; i++) {
        let box = [];
        for (let j = 0; j < gameObject.cols; j++) {
            box.push([]);
        }
        maps.push(box);
    }
    map = maps;
    gameObject.x = window.innerWidth / 2;
    gameObject.y = window.innerHeight / 4;
}

function update() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            map[i][j].drawCube().collision();
            if (gameObject.eventToPut) {
                map[i][j][gameObject.eventToPut]();
            }
        }
    }
}

let gridSize = 8;
let resolution = 64;
let groundLayers = 0.5;

function generatePerlinMatrix(gridSize, resolution, groundLayers) {
    let perlin = new Perlin();
    perlin.seed();
    let perlinMap = [];
    for (let y = 0; y < gridSize; y += gridSize / resolution) {
        let mapRow = [];
        for (let x = 0; x < gridSize; x += gridSize / resolution) {
            let v = parseInt((perlin.get(x, y) / 2 + groundLayers) * 55);//default 255
            mapRow.push(v);
        }
        perlinMap.push(mapRow);
    }
    return perlinMap;
}

function getIndexesOfRow(matrixRow) {
    let indexsOfLevelOne = [];
    for (let i = 0; i < matrixRow.length; i++) {
        if (matrixRow[i].level == 0) {
            indexsOfLevelOne.push(matrixRow.indexOf(matrixRow[i]));
        }
    }
    return indexsOfLevelOne;
}

function createStackedTiles(neededAmountOfTiles, baseTile) {
    let tiles = [];
    let height = 20;
    for (let i = 0; i < neededAmountOfTiles; i++) {
        let copy = Object.assign(new Iso3d(), baseTile);
        //from here you can add color based on height leveling
        copy.level = 1;
        copy.y -= height;
        height += 20;
        tiles.push(copy);
    }
    return tiles;
}

function generateRandomTerrain(mapOfAlreadyDefinedPerlinValues) {
    let randomMapMatrix = mapOfAlreadyDefinedPerlinValues;
    for (let i = 0; i < map.length; i++) {
        let indexesToStackOver = getIndexesOfRow(map[i]);
        let curr = 0;
        indexesToStackOver.forEach(index => {
            try {
                let currIndex = getIndexesOfRow(map[i])[curr];
                map[i].splice(currIndex, 0, ...createStackedTiles(randomMapMatrix[i][curr], map[i][currIndex]));
                currIndex = getIndexesOfRow(map[i]);
                curr++;
            } catch { }
        })
    };
    map.forEach(x => x.sort((a, b) => { return a.x - b.x || b.y - a.y }));
    deleteEveryTileNotSeenByTheCamera();
}

function changeToDefault(el) {
    el.isVisible = true;
    el.leftColor = "#808080";
    el.rightColor = "#A9A9A9";
}

function getCurrentMapHeights(map) {
    let heights = [];
    for (let i = map.length - 1; i >= 0; i--) {
        let box = "";
        for (let j = 1; j < map[i].length; j++) {
            if (map[i][j].level == 0) {
                box += "0";
            } else {
                box += "1";
            }
        }
        heights.unshift(box.split("0").map(x => x = x.length + 1));
    }
    return heights;
}

function deleteEveryTileNotSeenByTheCamera() {
    let heights = getCurrentMapHeights(map);
    let indexesZero = [];

    for (let i = 0; i < map.length; i++) {
        let row = [];
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j].level == 0) {
                row.push(map[i].indexOf(map[i][j]));
            }
        }
        indexesZero.push(row);
    }
    for (let i = 0; i < heights.length; i++) {
        if (i % 2 !== 0) {
            for (let j = 0; j < heights[i].length - 1; j++) {
                let col1 = heights[i][j];
                let col2 = heights[i - 1][j];
                let downZeroI = indexesZero[i][j];
                let upZeroI = indexesZero[i - 1][j];

                if (col1 > col2) {
                    let copy = map[i].slice().splice(downZeroI, col2)
                    copy.forEach(x => {
                        x.rightColor = "red";
                        x.leftColor = "red";
                    })

                    let razlika = col1 - col2;
                    let copy2 = map[i - 1].slice().splice(upZeroI, col1 - razlika - 1)
                    copy2.forEach(x => {
                        x.rightColor = "red";
                        x.leftColor = "red";
                    })
                }
                else if (col1 < col2) {
                    let copy = map[i - 1].slice().splice(upZeroI, col1)
                    copy.forEach(x => {
                        x.rightColor = "yellow";
                        x.leftColor = "yellow";
                    })
                    let razlika = col2 - col1;
                    let copy2 = map[i].slice().splice(downZeroI, col2 - razlika - 1)
                    copy2.forEach(x => {
                        x.rightColor = "yellow";
                        x.leftColor = "yellow";
                    })
                }
                else if (col1 == col2) {
                    let copy = map[i - 1].slice().splice(upZeroI, col1 - 1)
                    copy.forEach(x => {
                        x.rightColor = "green";
                        x.leftColor = "green";
                    })
                    let copy2 = map[i].slice().splice(downZeroI, col1 - 1)
                    copy2.forEach(x => {
                        x.rightColor = "green";
                        x.leftColor = "green";
                    })
                }
            }

        }
    }
    for (let i = 0; i < heights.length - 1; i++) {
        for (let j = 0; j < heights[i].length - 1; j++) {
            let upRow = heights[i][j];
            let secondUpRow = heights[i + 1][j];
            let downRow = heights[i][j + 1];
            let upIndex = indexesZero[i][j];
            let razlika = upRow - downRow;
            let secondRazlika = upRow - secondUpRow;
            if (secondRazlika > razlika) {
                if (secondRazlika > 1) {
                    let copy1 = map[i].slice().splice(upIndex, upRow);
                    copy1.forEach(x => changeToDefault(x))
                    let copy2 = map[i].slice().splice(upIndex, secondUpRow);
                    copy2.forEach(x => {
                        x.rightColor = "black";
                        x.leftColor = "black";
                    })
                }
            } else if (secondRazlika < razlika || secondRazlika === razlika) {
                if (razlika > 1) {
                    let copy1 = map[i].slice().splice(upIndex, upRow);
                    copy1.forEach(x => changeToDefault(x))
                    let copy2 = map[i].slice().splice(upIndex, downRow);
                    copy2.forEach(x => {
                        x.rightColor = "black";
                        x.leftColor = "black";
                    })
                }
            }

        }
    }
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j].rightColor == "black" || map[i][j].rightColor == "green" || map[i][j].rightColor == "yellow" || map[i][j].rightColor == "red") {
                map[i][j].isVisible = false;
            }
        }
    }
    map[map.length - 1].forEach(x => changeToDefault(x));
    for (let i = 0; i < map.length; i++) {
        map[i] = map[i].filter(item => item.isVisible !== false);
    }
}

function returnPerlinValues() {
    let values = {
        downCoord: document.getElementById("quantity4"),
        upCoord: document.getElementById("quantity3"),
        fieldValueGridSize: Number(document.getElementById("gridSize").value),
        fieldValueResolution: Number(document.getElementById("resolution").value),
        fieldValueGroundLayers: Number(document.getElementById("groundLayers").value),
    }
    values.updatePerlinValues = (upCoord, downCoord, gridSize, resolution, groundLayers) => {
        updateCoordsMap();
        drawIsometricTileMap(Number(upCoord), Number(downCoord));
        generateRandomTerrain(generatePerlinMatrix(gridSize, resolution, groundLayers));
    }
    return values;
}

function performPerlinMapUpdate(index, value) {
    try {
        let values = returnPerlinValues();
        let parts = [Number(values.upCoord.value), Number(values.downCoord.value), values.fieldValueGridSize, values.fieldValueResolution, values.fieldValueGroundLayers];
        parts[index] = Number(value.value);
        values.updatePerlinValues(...parts);
        gameObject.activateStroke = false;
        gameObject.isScrolling = setTimeout(function() {
            gameObject.activateStroke = true;
        }, 100);
    }
    catch (err) {
        alert("Invalid Operation!\nMake sure PerlinMapRowsAndColumns, GridSize, Resolution and GroundLayers are included!");
    }
}

function render() {
    requestAnimationFrame(render);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    canvas.style.cursor = "default";
    update();
}

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

window.addEventListener("keypress", function (e) {
    gameObject.key = e.key
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            switch (e.code) {
                case "KeyW": map[i][j].y += 10;gameObject.activateStroke = false; break;
                case "KeyS": map[i][j].y -= 10;gameObject.activateStroke = false; break;
                case "KeyA": map[i][j].x += 10;gameObject.activateStroke = false; break;
                case "KeyD": map[i][j].x -= 10;gameObject.activateStroke = false; break;
            }
        }
    }
})

window.addEventListener("keyup", function () {
    gameObject.activateStroke = true;
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
    if (delta) zoom(delta);
    gameObject.activateStroke = false;

    window.clearTimeout( gameObject.isScrolling );
    gameObject.isScrolling = setTimeout(function() {
        gameObject.activateStroke = true;
	}, 100);
    
    return evt.preventDefault() && false;
};

canvas.addEventListener('mousewheel', handleScroll, false);
