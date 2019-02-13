class Actor {
    constructor(name, pos, size, sprites) {
        this.act = (step, level, keys) => { };
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.sprites = "img/actors/" + sprites + ".png";
    }
}
class Npc extends Actor {
    constructor(name, pos, size, sprites, message) {
        super(name, pos, size, sprites);
        this.message = "";
        this.messageArrow = false;
        this.direction = true;
        this.act = (step, level, keys) => {
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
        };
        this.message = message;
    }
}
class Teleporter extends Actor {
    constructor(name, pos, size, sprites, level, newPos, newDirection) {
        super(name, pos, size, sprites);
        this.act = (step, level, keys) => {
            if (level.actorAt(level.actors.get("player")) && level.actorAt(level.actors.get("player")).name === this.name) {
                game.changeLevel(this.level, this.newPos, this.newDirection);
            }
        };
        this.level = level;
        this.newPos = newPos;
        this.newDirection = newDirection;
    }
}
