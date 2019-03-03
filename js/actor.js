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
                this.level.actors.forEach(actor => {
                    if (actor instanceof Projectile) {
                        this.level.actors.delete(actor.name.toLowerCase());
                    }
                });
                game.changeLevel(this.level, this.newPos, this.direction);
            }
        };
        this.level = level;
        this.newPos = newPos;
    }
}
class Hitbox extends Actor {
    constructor(name, pos, size, sprites, direction, activeFrame, actor, target) {
        super(name, pos, size, sprites, direction);
        this.updatePos = (step, level) => {
            if (!this.actor.pos.equals(this.lastActorPos) && (this.actor instanceof Enemy || this.actor instanceof Player)) {
                this.pos = this.pos.plus(this.lastActorPos.plus(this.actor.pos));
            }
        };
        this.act = (step, level, keys) => {
            this.updatePos(step, level);
            if (this.activeFrame <= 0) {
                level.actors.delete(this.name.toLowerCase());
            }
            this.activeFrame--;
        };
        this.activeFrame = activeFrame;
        this.actor = actor;
        this.lastActorPos = actor.pos;
        this.target = target;
    }
}
class Projectile extends Actor {
    constructor(name, pos, size, sprites, direction, path) {
        super(name, pos, size, sprites, direction);
        this.speed = new Vector2D(0, 0);
        this.xSpeed = 10;
        this.ySpeed = 10;
        this.gravity = null;
        this.lastFrame = 120;
        this.act = (step, level, keys) => {
            this.speed.x = this.path.x * this.xSpeed;
            if (!this.gravity) {
                this.speed.y = this.path.y * this.ySpeed;
            }
            else {
                this.speed.y += this.gravity * step;
            }
            var motion = this.speed.times(step);
            var newPos = this.pos.plus(motion);
            var obstacle = level.obstacleAt(newPos, this.size);
            var wood = obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right");
            if (obstacle && !wood || obstacle && wood && this.pos.y + this.size.y < obstacle.pos.y || obstacle && wood && this.pos.y + this.size.y === obstacle.pos.y) {
                this.lastFrame--;
            }
            else {
                this.pos = newPos;
            }
            this.pos.x = Math.round(this.pos.x * 100) / 100;
            this.pos.y = Math.round(this.pos.y * 100) / 100;
            if (this.lastFrame === 0) {
                level.actors.delete(this.name.toLowerCase());
            }
        };
        this.path = path;
    }
}
