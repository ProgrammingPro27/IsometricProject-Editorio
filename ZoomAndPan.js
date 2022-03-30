const view = (() => {
    const matrix = [1, 0, 0, 1, 0, 0];
    let m = matrix;
    let scale = 1;
    let ctx;
    const pos = { x: 0, y: 0 };
    let dirty = true;
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
        }, pan(amount) {
            if (dirty) { this.update() }
            pos.x += amount.x;
            pos.y += amount.y;
            dirty = true;
        }, scaleAt(at, amount) {
            if (dirty) { this.update() }
            scale *= amount;
            pos.x = at.x - (at.x - pos.x) * amount;
            pos.y = at.y - (at.y - pos.y) * amount;
            dirty = true;
        },
    };
    return API;
})();