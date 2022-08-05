function Iso3d(ctx, x, y, width, h) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.h = h;
    this.flag = false;
    this.colors = ["#808080", "#A9A9A9", "#909090"];
};
Iso3d.prototype.drawCube = function (stroke) {
    let f1 = this.width * 0.5, f2 = this.y - this.h, f3 = this.x - this.width, f4 = this.x + this.width, f5 = f2 - f1;
    let sides = [[this.y, f3, this.y - f1, f3, f5, this.x, f2 * 1],
    [this.y, f4, this.y - f1, f4, f5, this.x, f2 * 1],
    [f2, f3, f5, f3 + this.width, f2 - f1 * 2, f4, f5]];
    for (let i = 0; i < sides.length; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, sides[i][0]);
        this.ctx.lineTo(sides[i][1], sides[i][2]);
        this.ctx.lineTo(sides[i][3], sides[i][4]);
        this.ctx.lineTo(sides[i][5], sides[i][6]);
        this.ctx.closePath();
        this.ctx.fillStyle = this.colors[i];
        if (stroke == undefined) {
            this.ctx.stroke();
        };
        this.ctx.fill();
    };
    return this;
};
Iso3d.prototype.collision = function (mouseX, mouseY) {
    this.flag = false;
    if (this.ctx.isPointInPath(mouseX, mouseY)) {
        this.flag = true;
    };
    return this;
};
Iso3d.prototype.eventInitializer = function (event, key) {
    let value = this;
    if (value.flag === true) {
        this.ctx.canvas.onclick = function () {
            if (value.flag === true) {
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
            };
        };
    };
};
