function Chunk() {
    this.mapData = {};
    this.flying = 0;
    this.flying2 = 0;
};
Chunk.prototype.createFlatChunk = function (canvas, ctx, tileW, tileZ, x, y, mapX, mapY, code) {
    let oriX = Number(x);
    let oriY = Number(y);
    let map = [];

    for (let i = 0; i < mapX; i++) {
        let mapRow = [];
        for (let j = 0; j < mapY; j++) {
            let isoCube = new Iso3d(canvas, ctx, x, y, tileW, tileW, tileZ);
            x += tileW;
            y += tileW / 2;
            mapRow.push(isoCube);
        };
        oriX -= tileW;
        oriY += tileW / 2;
        x = oriX;
        y = oriY;
        map.push(mapRow);
    };
    this.mapData[code] = map;
    return this;
};
Chunk.prototype.loadChunk = function (code, mouseX, mouseY, operation, stroke, key) {
    if (this.mapData[code]) {
        for (let i = 0; i < this.mapData[code].length; i++) {
            for (let j = 0; j < this.mapData[code][i].length; j++) {
                this.mapData[code][i][j].drawCube(stroke).collision(this.mapData[code], mouseX, mouseY)
                if (operation) {
                    if (operation !== "colorise") {
                        this.mapData[code][i][j][operation](this.mapData[code]);
                    } else {
                        this.mapData[code][i][j][operation](key);
                    };
                };
            };
        };
    };
    return this;
};
Chunk.prototype.cleanChunk = function (code) {
    for (let i = 0; i < this.mapData[code].length; i++) {
        this.mapData[code][i] = [];
    };
    x = window.innerWidth / 2;
    y = window.innerHeight / 4;
    return this;
};
Chunk.prototype.createPerlinChunk = function (size, perlin, code, gridSize, resolution, groundLayers, heightLimit, num, op, num1, op2) {
    if ((gridSize / resolution) == gridSize || gridSize == resolution || (gridSize % resolution) == 0) {
        resolution = this.mapData[code].length;
    }
    if (num, op, num1, op2) {
        eval(`this.${num} ${op}= gridSize / resolution;this.${num1} ${op2}= gridSize / resolution`);
    }
    //if (this.mapData[code]) {
        let yoff = this.flying2;
        for (let y = 0; y < size; y++) {
            let xoff = this.flying;
            for (let x = 0; x < size; x++) {
                let v = parseInt((perlin.get(xoff, yoff) + groundLayers) * heightLimit);//default 255     
                if (v < 0) {
                    v = 0;
                }
                this.mapData[code][x][y].h = v;
                xoff += gridSize / resolution;
            };
            yoff += gridSize / resolution;
        };
    //};
    return this;
};
