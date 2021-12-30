function Chunk() {
    this.mapData = {};
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
Chunk.prototype.createPerlinChunk = function (perlin, code, gridSize, resolution, groundLayers) {
    if (resolution < this.mapData[code].length) {
        resolution = this.mapData[code].length
        alert("Invalid resoulution, increase the resolution in order to continue!")
    }
    let map = [];
    for (let y = 0; y < gridSize; y += gridSize / resolution) {
        let row = [];
        for (let x = 0; x < gridSize; x += gridSize / resolution) {
            let v = parseInt((perlin.get(x, y) / 2 + groundLayers) * 55);//default 255     
            row.push(v);
        };
        map.push(row);
    };

    if (map.length >= this.mapData[code].length) {
        for (let i = 0; i < this.mapData[code].length; i++) {
            for (let j = 0; j < this.mapData[code][i].length; j++) {
                this.mapData[code][i][j].h *= map[i][j];
            };
        };
    } else {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                this.mapData[code][i][j].h *= map[i][j];
            };
        };
    };
    return this;
};