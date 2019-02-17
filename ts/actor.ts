class Actor {

    public name: string;
    public pos: Vector2D;
    public size: Vector2D;
    public sprites: string;
    public direction: boolean;

	constructor (name: string, pos: Vector2D, size: Vector2D, sprites: string, direction: boolean) {
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.sprites = "img/actors/" + sprites + ".png";
        this.direction = direction;
    }

    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {}
}

class Npc extends Actor {

    public message: string = "";
    public messageArrow = false;
    public behavior: string;

    constructor(name: string, pos: Vector2D, size: Vector2D, sprites: string, direction: boolean, message: string, behavior: string) {
        super(name, pos, size, sprites, direction);
        this.message = message;
        this.behavior = behavior;
    }
    
    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {
        if (this.behavior === "watch") {
            if (level.actors.get("player").pos.x > this.pos.x) { this.direction = true; }
            else { this.direction = false; }
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

    constructor(name: string, pos: Vector2D, size: Vector2D, sprites: string, level: Level, newPos: Vector2D, direction: boolean) {
        super(name, pos, size, sprites, direction);
        this.level = level;
        this.newPos = newPos;
    }

    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {
        if (level.actorAt(level.actors.get("player")) && level.actorAt(level.actors.get("player")).name === this.name) {
			game.changeLevel(this.level, this.newPos, this.direction);
        }
    }
}