function Chunk() {
    this.mapData = {};
};
Chunk.prototype.createFlatChunk = function (mapX, mapY, code) {
    let tileW = 50;
    let tileH = 50;
    let tileZ = 20;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 4;
    let oriX = window.innerWidth / 2;
    let oriY = window.innerHeight / 4;
    let map = [];

    for (let i = 0; i < mapX; i++) {
        let mapRow = [];
        for (let j = 0; j < mapY; j++) {
            let isoCube = new Iso3d(x, y, tileW, tileH, tileZ);
            x += tileW;
            y += tileH / 2;
            mapRow.push(isoCube);
        };
        oriX -= tileW;
        oriY += tileH / 2;
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
Chunk.prototype.createPerlinChunk = function (code, gridSize, resolution, groundLayers) {
    let perlin = new Perlin();
    perlin.seed();
    let map = [];
    resolution = Math.abs(resolution);
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

    this.mapData[code].forEach(x => x.sort((a, b) => { return a.x - b.x || b.y - a.y }));
    return this;
};