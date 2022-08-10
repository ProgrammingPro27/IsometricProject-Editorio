function Iso3d(x, y, width, h) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.h = h;
    this.flag = false;
    this.colors = ["#808080", "#A9A9A9", "#909090"];
};
Iso3d.prototype.drawCube = function () {
    let ss = [this.width * 0.5, this.y - this.h, this.x - this.width, this.x + this.width];
    ss[4] = ss[1] - ss[0];
    this.path = [new Path2D(), new Path2D(), new Path2D()];
    let drawSide = (path, args) => {
        path.moveTo(args[0], args[1]);
        path.lineTo(args[2], args[3]);
        path.lineTo(args[4], args[5]);
        path.lineTo(args[6], args[7]);
    };
    drawSide(this.path[0], [this.x, this.y, ss[2], this.y - ss[0], ss[2], ss[4], this.x, ss[1] * 1]);
    drawSide(this.path[1], [this.x, this.y, ss[3], this.y - ss[0], ss[3], ss[4], this.x, ss[1] * 1]);
    drawSide(this.path[2], [this.x, ss[1], ss[2], ss[4], ss[2] + this.width, ss[1] - ss[0] * 2, ss[3], ss[4]]);
    return this;
};
Iso3d.prototype.fillCube = function (ctx) {
    ctx.fillStyle = this.colors[0];
    ctx.fill(this.path[0]);
    ctx.fillStyle = this.colors[1];
    ctx.fill(this.path[1]);
    ctx.fillStyle = this.colors[2];
    ctx.fill(this.path[2]);
    return this;
};
Iso3d.prototype.fillStrokeCube = function (ctx) {
    this.fillCube(ctx);
    ctx.stroke(this.path[0]);
    ctx.stroke(this.path[1]);
    ctx.stroke(this.path[2]);
    return this;
};
Iso3d.prototype.collision = function (ctx, mouseX, mouseY, event, key) {
    this.flag = false;
    for (let i = 0; i < this.path.length; i++) {
        if (ctx.isPointInPath(this.path[i], mouseX, mouseY)) {
            this.flag = true;
        };
    };
    let value = this;
    if (value.flag == true) {
        ctx.canvas.onclick = function () {
            if (value.flag == true) {
                let events = {
                    increaseSize: () => {
                        value.h += 5;
                    },
                    removeTile: () => {
                        if (value.h - 50 < 0) {
                            value.h = 0;
                        } else {
                            value.h -= 50;
                        };
                    },
                    colorise: () => {
                        let colors = {
                            Digit1: ["#FFFCFC", "#FFFBFB", "#FFFAFA"],//snow Block
                            Digit2: ["#2389da", "#2389da", "#2389da"],//water Block
                            Digit3: ["#4D525B", "#787F8E", "#606672"],//stone Block 
                            Digit4: ["#cabc91", "#dbd1b4", "#d3c7a2"],//sand Block 
                            Digit5: ["#8B4513", "#A0522D", "#6B8E23"]//grass Block 
                        };
                        if (colors[key]) {
                            value.colors = colors[key];
                        };
                    }
                };
                events[event]();
                value.drawCube();
            };
        };
    };
    return this;
};
