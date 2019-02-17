class Actor {
    constructor(name, pos, size, sprites, direction) {
        this.act = (step, level, keys) => { };
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.sprites = "img/actors/" + sprites + ".png";
        this.direction = direction;
    }
}
class Npc extends Actor {
    constructor(name, pos, size, sprites, direction, message, behavior) {
        super(name, pos, size, sprites, direction);
        this.message = "";
        this.messageArrow = false;
        this.act = (step, level, keys) => {
            if (this.behavior === "watch") {
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
        this.behavior = behavior;
    }
}
class Teleporter extends Actor {
    constructor(name, pos, size, sprites, level, newPos, direction) {
        super(name, pos, size, sprites, direction);
        this.act = (step, level, keys) => {
            if (level.actorAt(level.actors.get("player")) && level.actorAt(level.actors.get("player")).name === this.name) {
                game.changeLevel(this.level, this.newPos, this.direction);
            }
        };
        this.level = level;
        this.newPos = newPos;
    }
}
