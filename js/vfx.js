class Vfx {
    constructor(name, pos, size, direction, type, activeFrame) {
        this.act = (step, level, keys) => {
            if (this.activeFrame <= 0) {
                level.vfx.delete(this.name);
            }
            this.activeFrame--;
        };
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.direction = direction;
        this.type = type;
        this.activeFrame = activeFrame;
    }
}
