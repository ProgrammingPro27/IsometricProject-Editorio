function Iso3d(canvas, ctx, x, y, width, h) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.h = h;
    this.flag = false;
    this.leftColor = "#808080";
    this.rightColor = "#A9A9A9";
    this.topColor = "#909090";
};
Iso3d.prototype.drawCube = function (stroke) {
    let side = (el, p1, p2, p3, p4, p5, p6, p7, p8, p9, stroke) => {
        el.ctx.beginPath();
        el.ctx.moveTo(p1, p2);
        el.ctx.lineTo(p3, p4);
        el.ctx.lineTo(p5, p6);
        el.ctx.lineTo(p7, p8);
        el.ctx.closePath();
        el.ctx.fillStyle = p9;
        el.ctx.fill();
        if (stroke === true) {
            el.ctx.stroke();
        };
    }
    let f1 = this.width * 0.5, f2 = this.y - this.h, f3 = this.x - this.width, f4 = this.x + this.width, f5 = f2 - f1;
    side(this, this.x, this.y, f3, this.y - f1, f3, f5, this.x, f2 * 1, this.leftColor, stroke);
    side(this, this.x, this.y, f4, this.y - f1, f4, f5, this.x, f2 * 1, this.rightColor, stroke);
    side(this, this.x, f2, f3, f5, f3 + this.width, f2 - f1 * 2, f4, f5, this.topColor, stroke);
    return this;
};
Iso3d.prototype.collision = function (mouseX, mouseY) {
    if (this.ctx.isPointInPath(mouseX, mouseY)) {
        this.flag = true;
    } else {
        this.flag = false;
    };
    return this;
};
Iso3d.prototype.eventInitializer = function (event, map, key) {
    let value = this;
    if (value.flag === true) {
        this.canvas.onclick = function () {
            if (value.flag === true) {
                let events = {
                    increaseSize: () => {
                        value.h += 5;
                    },
                    removeTile: () => {
                        for (let i = 0; i < map.length; i++) {
                            map[i] = map[i].filter(item => item !== value);
                        }
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
                            value.leftColor = colors[key][0];
                            value.rightColor = colors[key][1];
                            value.topColor = colors[key][2];
                        };
                    }
                };
                events[event]();
            };
        };
    };
};
