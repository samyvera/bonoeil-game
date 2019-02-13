class Actor {

    public name: string;
    public pos: Vector2D;
    public size: Vector2D;
    public sprites: string;

	constructor (name: string, pos: Vector2D, size: Vector2D, sprites: string) {
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.sprites = "img/actors/" + sprites + ".png";
    }

    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {}
}

class Npc extends Actor {

    public message: string = "";
    public messageArrow = false;
    public direction: boolean = true;

    constructor(name: string, pos: Vector2D, size: Vector2D, sprites: string, message: string) {
        super(name, pos, size, sprites);
        this.message = message;
    }
    
    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {
        if (this.name === "Villager") {
            if (level.actors.get("player").pos.x > this.pos.x) {
                this.direction = true;
            }
            else {
                this.direction = false;
            }
        }
        if (level.actorAt(level.actors.get("player")) && level.actorAt(level.actors.get("player")).name === this.name) {
            this.messageArrow = true;
        }
        else {
            this.messageArrow = false;
        }
    }
}

class Teleporter extends Actor {

    public level: Level;
    public newPos: Vector2D;
    public newDirection: boolean;

    constructor(name: string, pos: Vector2D, size: Vector2D, sprites: string, level: Level, newPos: Vector2D, newDirection: boolean) {
        super(name, pos, size, sprites);
        this.level = level;
        this.newPos = newPos;
        this.newDirection = newDirection;
    }

    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {
        if (level.actorAt(level.actors.get("player")) && level.actorAt(level.actors.get("player")).name === this.name) {
			game.changeLevel(this.level, this.newPos, this.newDirection);
        }
    }
}