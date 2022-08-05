function Chunk(ctx) {
    this.mapData = {};
    this.ctx = ctx;
    this.flying = 0;
    this.flying2 = 0;
};
Chunk.prototype.createFlatChunk = function (tileW, tileZ, x, y, mapX, mapY, code) {
    let oriX = x, oriY = y;
    this.mapData[code] = [];
    for (let i = 0; i < mapX; i++) {
        let mapRow = [];
        for (let j = 0; j < mapY; j++) {
            mapRow[j] = new Iso3d(x, y, tileW, tileZ);
            x += tileW;
            y += tileW / 2;
        };
        x = oriX -= tileW;
        y = oriY += tileW / 2;
        this.mapData[code][i] = mapRow;
    };
    return this;
};
Chunk.prototype.loadChunk = function (code, mouseX, mouseY, operation, stroke, key) {
    if (this.mapData[code]) {
        for (let i = 0; i < this.mapData[code].length; i++) {
            for (let j = 0; j < this.mapData[code][i].length; j++) {
                this.mapData[code][i][j].drawCube(this.ctx, stroke);
                if (operation) {
                    this.mapData[code][i][j].collision(this.ctx, mouseX, mouseY).eventInitializer(this.ctx, operation, key);
                };
            };
        };
    };
    return this;
};
Chunk.prototype.createPerlinChunk = function (size, perlin, code, gridSize, resolution, groundLayers, heightLimit, num, op, num1, op2) {
    if (resolution != 0) {
        if (num, op) {
            eval(`this.${num} ${op}= gridSize / resolution`);
        };
        if (num1, op2) {
            eval(`this.${num1} ${op2}= gridSize / resolution`);
        };
        let yoff = this.flying2;
        for (let y = 0; y < size; y++) {
            let xoff = this.flying;
            for (let x = 0; x < size; x++) {
                let v = parseInt((perlin.get(xoff, yoff) + groundLayers) * heightLimit);
                if (v < 0) { v = 0; }
                this.mapData[code][x][y].h = v;
                xoff += gridSize / resolution;
            };
            yoff += gridSize / resolution;
        };
    };
    return this;
};
