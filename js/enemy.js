class Enemy extends Actor {
    constructor(name, pos, size, sprites, direction) {
        super(name, pos, size, sprites, direction);
        this.speed = new Vector2D(0, 0);
        this.input = null;
        this.action = null;
        this.actionFrame = 0;
        this.frame = 0;
        this.status = null;
        this.maxHealth = 3;
        this.health = 3;
        this.xDirection = 0;
        this.xSpeed = scale / 8;
        this.jumpSpeed = scale / 2;
        this.gravity = scale * 2;
        this.controls = [false];
        this.moveX = (step, level) => {
            this.speed.x = 0;
            if (this.controls[1]) {
                this.xDirection = Math.floor(Math.random() * 3);
            }
            else if (this.speed.y === 0) {
                this.xDirection = 0;
            }
            if (this.xDirection === 1) {
                this.speed.x += this.xSpeed;
            }
            else if (this.xDirection === 2) {
                this.speed.x -= this.xSpeed;
            }
            var motion = new Vector2D(this.speed.x * step, 0);
            var newPos = this.pos.plus(motion);
            var obstacle = level.obstacleAt(newPos, this.size);
            if (!obstacle || obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right")) {
                this.pos = newPos;
            }
            this.pos.x = Math.round(this.pos.x * 100) / 100;
        };
        this.moveY = (step, level) => {
            if (this.controls[1]) {
                this.speed.y = -this.jumpSpeed;
                if (Math.floor(Math.random() * 3) === 2) {
                    this.speed.y *= 1.5;
                }
            }
            this.speed.y += step * this.gravity;
            var motion = new Vector2D(0, this.speed.y * step);
            var newPos = this.pos.plus(motion);
            var obstacle = level.obstacleAt(newPos, this.size);
            var wood = obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right");
            if (obstacle && !wood || obstacle && wood && this.pos.y + this.size.y < obstacle.pos.y || obstacle && wood && this.pos.y + this.size.y === obstacle.pos.y) {
                if (this.speed.y > 0) {
                    this.speed.y = 0;
                    this.pos.y = Math.round(this.pos.y * 10) / 10;
                    if (this.action !== "attack") {
                        this.action = null;
                    }
                }
                else {
                    this.speed.y = -1;
                }
            }
            else {
                this.pos = newPos;
            }
            this.pos.y = Math.round(this.pos.y * 100) / 100;
        };
        this.attack = (step, level) => {
            this.actionFrame++;
            if (this.input === "attack") {
                this.actionFrame = 0;
            }
            if (this.actionFrame === 40) {
                let pathX;
                if (this.direction) {
                    pathX = 1;
                }
                else {
                    pathX = -1;
                }
                level.actors.set("cog" + this.name.toLowerCase() + this.frame, new Projectile("Cog" + this.name + this.frame, this.pos.plus(new Vector2D(0.5, 0.5)), new Vector2D(0.5, 0.5), "cog", true, new Vector2D(pathX, 0)));
            }
            if (this.actionFrame === 60) {
                this.action = null;
            }
        };
        this.knockback = (step, level) => {
            if (this.actionFrame === 0) {
                this.speed.y = -this.jumpSpeed * 0.75;
            }
            if (this.direction) {
                this.speed.x = -this.xSpeed;
            }
            else {
                this.speed.x = this.xSpeed;
            }
            this.speed.y += step * this.gravity;
            var motion = this.speed.times(step);
            var newPos = this.pos.plus(motion);
            var obstacle = level.obstacleAt(newPos, this.size);
            var wood = obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right");
            if (obstacle && !wood || obstacle && wood && this.pos.y + this.size.y < obstacle.pos.y || obstacle && wood && this.pos.y + this.size.y === obstacle.pos.y) {
                if (this.speed.y > 0) {
                    this.speed.y = 0;
                    this.pos.y = Math.round(this.pos.y * 10) / 10;
                }
                else {
                    this.speed.y = -1;
                }
            }
            else {
                this.pos = newPos;
            }
            this.pos.x = Math.round(this.pos.x * 100) / 100;
            this.pos.y = Math.round(this.pos.y * 100) / 100;
            this.actionFrame++;
            if (this.actionFrame === 32) {
                this.speed = new Vector2D(0, 0);
                this.status = null;
                this.action = null;
            }
        };
        this.die = (step, level) => {
            if (this.actionFrame > 20) {
                level.actors.delete(this.name.toLowerCase());
            }
            this.actionFrame++;
        };
        this.act = (step, level, keys) => {
            this.controls = [
                (this.frame % 200 === 0),
                (this.frame % 64 === 0)
            ];
            var actor = level.actorAt(this);
            if ((this.status === null || this.status === "stagger" && this.actionFrame > 8) && actor && actor instanceof Hitbox && actor.target === "enemy") {
                this.status = "stagger";
                this.actionFrame = 0;
                this.health--;
                if (actor.actor instanceof Player && actor.actor.action === "jabAttack3") {
                    let posX;
                    if (this.direction) {
                        posX = -this.size.x - 2;
                    }
                    else {
                        posX = 0;
                    }
                    level.vfx.set(("vfx2" + level.frame + this.name).toLowerCase(), new Vfx(("vfx2" + level.frame + this.name).toLowerCase(), this.pos.plus(new Vector2D(posX, -2)), new Vector2D(4, 4), this.direction, "vfx2", 16));
                }
                if (actor.actor instanceof Player) {
                    level.vfx.set(("vfx1" + level.frame + this.name).toLowerCase(), new Vfx(("vfx1" + level.frame + this.name).toLowerCase(), this.pos.plus(new Vector2D(this.size.x / 2 - 1, this.size.y / 2 - 1)), new Vector2D(2, 2), this.direction, "vfx1", 16));
                    let posX;
                    if (this.direction) {
                        posX = -this.size.x - 2;
                    }
                    else {
                        posX = 0;
                    }
                    level.vfx.set(("vfx4" + level.frame + this.name).toLowerCase(), new Vfx(("vfx4" + level.frame + this.name).toLowerCase(), this.pos.plus(new Vector2D(posX, -2)), new Vector2D(2, 4), this.direction, "vfx4", 16));
                }
            }
            else if (this.status === "die" && this.actionFrame === 1) {
                level.vfx.set(("vfx3" + level.frame + this.name).toLowerCase(), new Vfx(("vfx3" + level.frame + this.name).toLowerCase(), this.pos.plus(new Vector2D(this.size.x / 2 - 2, this.size.y / 2 - 2)), new Vector2D(4, 4), this.direction, "vfx3", 16));
            }
            if (this.status === null) {
                if (level.actors.get("player").pos.x > this.pos.x) {
                    this.direction = true;
                }
                else {
                    this.direction = false;
                }
                if (this.controls[0] && this.action === null) {
                    this.input = "attack";
                    this.action = "attack";
                }
                if (this.action === null) {
                    this.moveX(step, level);
                    this.moveY(step, level);
                }
                else if (this.action === "attack") {
                    this.moveX(step, level);
                    this.moveY(step, level);
                    this.attack(step, level);
                }
            }
            else if (this.status === "stagger") {
                this.knockback(step, level);
            }
            if (this.status === "die" || this.health <= 0) {
                if (this.status !== "die") {
                    this.actionFrame = 0;
                }
                this.status = "die";
                this.die(step, level);
            }
            this.input = null;
            this.frame++;
        };
    }
}
