class Vfx {

    public name: string;
    public pos: Vector2D;
    public size: Vector2D;
    public direction: boolean;
    public type: string;
    public activeFrame: number;
    
    constructor(name: string, pos: Vector2D, size: Vector2D, direction: boolean, type: string, activeFrame: number) {
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.direction = direction;
        this.type = type;
        this.activeFrame = activeFrame;
    }
    
    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {
        if (this.activeFrame <= 0) {
			level.vfx.delete(this.name);
        }
        this.activeFrame--;
    }
}