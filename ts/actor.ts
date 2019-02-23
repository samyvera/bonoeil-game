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

class Projectile extends Actor {

    public path: Vector2D;
    public speed: Vector2D = new Vector2D(0, 0);
    public xSpeed: number = scale / 2;
    public ySpeed: number = scale / 2;
    public gravity: number = null;

    constructor(name: string, pos: Vector2D, size: Vector2D, sprites: string, direction: boolean, path: Vector2D) {
        super(name, pos, size, sprites, direction);
        this.path = path;
    }

    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {
        this.speed.x = this.path.x * this.xSpeed;
        if (!this.gravity) {
            this.speed.y = this.path.y * this.ySpeed;
        }
        else {
            this.speed.y += this.gravity * step;
        }

		var motion: Vector2D = this.speed.times(step);
		var newPos: Vector2D = this.pos.plus(motion);
		var obstacle: Bloc = level.obstacleAt(newPos, this.size);
        var wood: boolean = obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right");

		if (obstacle && !wood || obstacle && wood && this.pos.y + this.size.y < obstacle.pos.y || obstacle && wood && this.pos.y + this.size.y === obstacle.pos.y) {
			level.actors.delete(this.name.toLowerCase());
		}
		else {
			this.pos = newPos;
		}
		this.pos.x = Math.round(this.pos.x * 100) / 100;
		this.pos.y = Math.round(this.pos.y * 100) / 100;
    }
}