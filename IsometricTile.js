function Iso3d(x, y, wx, wy, h, flag) {
    this.x = x;
    this.y = y;
    this.wx = wx;
    this.wy = wy;
    this.h = h;
    this.flag = flag;
    this.leftColor = "#808080";
    this.rightColor = "#A9A9A9";
    this.topColor = "#909090";
    this.cellCoordinate = { row: null, col: null };
};
Iso3d.prototype.drawCube = function (stroke) {
    let sides = [{
        moveTo: [this.x, this.y],
        sides: [[this.x - this.wx, this.y - this.wx * 0.5], [this.x - this.wx, this.y - this.h - this.wx * 0.5], [this.x, this.y - this.h * 1]],
        color: this.leftColor
    }, {
        moveTo: [this.x, this.y],
        sides: [[this.x + this.wy, this.y - this.wy * 0.5], [this.x + this.wy, this.y - this.h - this.wy * 0.5], [this.x, this.y - this.h * 1]],
        color: this.rightColor
    }, {
        moveTo: [this.x, this.y - this.h],
        sides: [[this.x - this.wx, this.y - this.h - this.wx * 0.5], [this.x - this.wx + this.wy, this.y - this.h - (this.wx * 0.5 + this.wy * 0.5)], [this.x + this.wy, this.y - this.h - this.wy * 0.5]],
        color: this.topColor
    }];

    for (let i = 0; i < sides.length; i++) {
        ctx.beginPath();
        ctx.moveTo(...sides[i].moveTo);
        for (let j of sides[i].sides) {
            ctx.lineTo(...j);
        };
        ctx.closePath();
        ctx.fillStyle = sides[i].color;
        ctx.fill();
        if (stroke === true) {
            ctx.stroke();
        };
    };
    return this;
};
Iso3d.prototype.collision = function (map, mouseX, mouseY) {
    if (ctx.isPointInPath(mouseX, mouseY)) {
        this.flag = true;
        for (let i = 0; i < map.length; i++) {
            let index = map[i].indexOf(this);
            if (index !== -1) {
                this.cellCoordinate.row = i;
                this.cellCoordinate.col = index;
            };
        };
        canvas.style.cursor = "pointer";
        return this;
    } else {
        this.flag = false;
        this.cellCoordinate.row = null;
        this.cellCoordinate.col = null;
        return this;
    };
};
Iso3d.prototype.increaseSize = function () {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            if (value.flag === true) {
                value.h += 5;
            };
        };
    };
    return this;
};
Iso3d.prototype.removeTile = function (map) {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            if (value.flag === true) {
                let i = value.cellCoordinate.row;
                let j = value.cellCoordinate.col;
                if (i !== null && j !== null) {
                    map[i] = map[i].filter(item => item !== value);
                };
            };
        };
    };
    return this;
};
Iso3d.prototype.addUpperLevel = function (map) {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            if (value.flag === true) {
                let i = value.cellCoordinate.row;
                let j = value.cellCoordinate.col;
                let isoCube = new Iso3d(map[i][j].x, map[i][j].y - map[i][j].h, gameObject.tileW, gameObject.tileH, gameObject.tileZ);
                if (i !== null && j !== null) {
                    map[i].push(isoCube);
                    map[i] = map[i].sort((a, b) => { return a.x - b.x || b.y - a.y });
                };
            };
        };
    };
    return this;
};
Iso3d.prototype.colorise = function (key) {
    let value = this;
    if (value.flag === true) {
        canvas.onclick = function () {
            let colors = {
                Digit1: ["#FFFCFC", "#FFFBFB", "#FFFAFA"],//snow Block
                Digit2: ["#2389da", "#2389da", "#2389da"],//water Block
                Digit3: ["#4D525B", "#787F8E", "#606672"],//stone Block 
                Digit4: ["#cabc91", "#dbd1b4", "#d3c7a2"],//sand Block 
                Digit5: ["#8B4513", "#A0522D", "#6B8E23"]//grass Block 
            };
            value.leftColor = colors[key][0];
            value.rightColor = colors[key][1];
            value.topColor = colors[key][2];
        };
    };
};