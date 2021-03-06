class Player extends Actor {

	public speed: Vector2D = new Vector2D(0, 0);

	public input: string = null;
	public action: string = null;
	public actionFrame: number = 0;
	public jab1Buffer: boolean = false;
	public jab2Buffer: boolean = false;

	public status: string = null;
	public invincibleFrame: number = 0;
	public maxHealth: number = 20;
	public health: number = 20;

	public xSpeed: number = scale / 2;
	public jumpSpeed: number = scale * 0.75;
	public jumpFrame: number = 0;
	public gravity: number = scale * 4;

	public controls: Array<boolean> = [false, false, false, false, false, false];
	public controlsMemory: Array<boolean> = [false, false, false, false, false, false];

	constructor(name: string, pos: Vector2D, size: Vector2D, sprites: string, direction: boolean) {
		super(name, pos, size, sprites, direction);
	}

	public attackMoveX = (step: number, level: Level): void => {
		if ((this.input === "jabAttack1" || this.input === "jabAttack2" || this.input === "jabAttack3") && !(this.controls[2] && this.controls[3])) {
			if (this.controls[2]) { this.direction = false; }
			if (this.controls[3]) { this.direction = true; }
		}

		if (this.action === "jabAttack1") {
			this.speed.x = 0;

			if (this.direction) { this.speed.x += this.xSpeed / 8; }
			else { this.speed.x -= this.xSpeed / 8; }
		}
		else if (this.action === "jabAttack2") {
			this.speed.x = 0;

			if (this.direction) { this.speed.x += this.xSpeed / 4; }
			else { this.speed.x -= this.xSpeed / 4; }
		}
		else if (this.action === "jabAttack3") {
			this.speed.x = 0;

			if (this.direction) { this.speed.x += this.xSpeed / 4; }
			else { this.speed.x -= this.xSpeed / 4; }
		}

		var actor = level.actorAt(this);

		var motion: Vector2D = new Vector2D(this.speed.x * step, 0);
		var newPos: Vector2D = this.pos.plus(motion);
		var obstacle: Bloc = level.obstacleAt(newPos, this.size);
		if (!obstacle && (!actor || actor && !(actor instanceof Enemy))) {
			this.pos = newPos;
		}
		this.pos.x = Math.round(this.pos.x * 100) / 100;
	}

	public moveX = (step: number, level: Level): void => {
		if (!this.controls[2] && !this.controls[3] || this.controls[2] && this.controls[3]) {
			if (this.speed.x > 0) {
				this.speed.x -= this.xSpeed / scale;
			}
			else if (this.speed.x < 0) {
				this.speed.x += this.xSpeed / scale;
			}
			if (Math.round(this.speed.x) === 0) {
				this.speed.x = 0;
			}
		}
		else if (this.controls[2] && !this.controls[3] && this.action !== "landingAttack" && this.action !== "crouch") {
			this.speed.x = this.speed.x - this.xSpeed / scale * 2 > -this.xSpeed ? this.speed.x - this.xSpeed / scale * 2 : -this.xSpeed;
			if (this.action === null || this.action === "jump") {
				this.direction = false;
			}
		}
		else if (this.controls[3] && !this.controls[2] && this.action !== "landingAttack" && this.action !== "crouch") {
			this.speed.x = this.speed.x + this.xSpeed / scale * 2 < this.xSpeed ? this.speed.x + this.xSpeed / scale * 2 : this.xSpeed;
			if (this.action === null || this.action === "jump") {
				this.direction = true;
			}
		}
		if (this.action === "landingAttack" || this.action === "crouch") {
			this.speed.x -= this.speed.x / 8;
			if (Math.round(this.speed.x) === 0) {
				this.speed.x = 0;
			}
		}
		if (this.action === "crouch" && !(this.controls[2] && this.controls[3])) {
			if (this.controls[2]) { this.direction = false; }
			if (this.controls[3]) { this.direction = true; }
		}

		var motion: Vector2D = new Vector2D(this.speed.x * step, 0);
		var newPos: Vector2D = this.pos.plus(motion);
		var obstacle: Bloc = level.obstacleAt(newPos, this.size);

		if (!obstacle || obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right")) {
			this.pos = newPos;
		}
		this.pos.x = Math.round(this.pos.x * 100) / 100;
	}

	public moveY = (step: number, level: Level): void => {
		if (this.input === "jump") {
			this.action = "jump";
			this.jumpFrame = 0;
		}
		if (this.action === "jump" && this.controls[0] && this.jumpFrame < 6) {
			this.speed.y = -this.jumpSpeed * (this.jumpFrame / 4 + 0.25);
		}
		this.jumpFrame++;
		this.speed.y += step * this.gravity;

		var motion: Vector2D = new Vector2D(0, this.speed.y * step);
		var newPos: Vector2D = this.pos.plus(motion);
		var obstacle: Bloc = level.obstacleAt(newPos, this.size);
		var wood: boolean = obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right");

		if (obstacle && !wood || obstacle && wood && this.pos.y + this.size.y < obstacle.pos.y ||
			obstacle && wood && this.pos.y + this.size.y === obstacle.pos.y && !(this.controls[0] && this.controls[5])) {
			if (this.speed.y > 0) {
				this.speed.y = 0;
				this.pos.y = Math.round(this.pos.y * 10) / 10;
				if (this.pos.y % 0.5 !== 0) { this.pos.y = Math.round(this.pos.y) }
				if (this.action === "aerialAttack" || this.action === "landingAttack") {
					this.action = "landingAttack";
				}
				else if (this.action === "jabAttack1") {
					this.action = "jabAttack1";
				}
				else if (this.action === "jabAttack2") {
					this.action = "jabAttack2";
				}
				else if (this.action === "jabAttack3") {
					this.action = "jabAttack3";
				}
				else if (this.action === "crouch") {
					this.action = "crouch";
				}
				else {
					this.action = null;
				}
			}
			else {
				this.speed.y = -1;
			}
		}
		else {
			this.pos = newPos;
			if (this.action === "crouch") {
				this.action = null;
				this.size.y = 2;
				this.pos.y -= 0.5;
			}
		}
		this.pos.y = Math.round(this.pos.y * 100) / 100;
	}

	public attack = (step: number, level: Level) => {
		this.actionFrame++;

		if (this.input === "jabAttack1") {
			this.actionFrame = 0;
		}
		else if (this.input === "jabAttack2") {
			this.actionFrame = 0;
			this.jab1Buffer = false;
		}
		else if (this.input === "jabAttack3") {
			this.actionFrame = 0;
			this.jab2Buffer = false;
		}
		else if (this.input === "aerialAttack") {
			this.actionFrame = 0;
		}

		if (this.action === "jabAttack1") {
			if (this.input !== "jabAttack1" && this.controls[1] && !this.controlsMemory[1] && this.jab1Buffer) {
				this.jab2Buffer = true;
			}
			if (this.input !== "jabAttack1" && this.controls[1] && !this.controlsMemory[1]) {
				this.jab1Buffer = true;
			}

			if (this.actionFrame === 10) {
				let xPos: number;
				if (this.direction) { xPos = 0.5; }
				else { xPos = -1.75; }
				level.actors.set(("jabAttack1" + this.name).toLowerCase(),
					new Hitbox("JabAttack1" + this.name, this.pos.plus(new Vector2D(xPos, 0.5)), new Vector2D(2.25, 1.25), "null", true, 8, this, "enemy"));
			}

			if (this.actionFrame === 20 && !this.jab1Buffer) {
				this.action = null;
			}
		}
		else if (this.action === "jabAttack2") {
			if (this.input !== "jabAttack2" && this.controls[1] && !this.controlsMemory[1]) {
				this.jab2Buffer = true;
			}

			if (this.actionFrame === 12) {
				let xPos: number;
				if (this.direction) { xPos = 0.5; }
				else { xPos = -1.75; }
				level.actors.set(("jabAttack2" + this.name).toLowerCase(),
					new Hitbox("JabAttack2" + this.name, this.pos.plus(new Vector2D(xPos, 0.5)), new Vector2D(2.25, 1.25), "null", true, 8, this, "enemy"));
			}

			if (this.actionFrame === 24 && !this.jab2Buffer) {
				this.action = null;
			}
		}
		else if (this.action === "jabAttack3") {

			if (this.actionFrame === 12) {
				let xPos: number;
				if (this.direction) { xPos = 1.5; }
				else { xPos = -1.5; }
				level.actors.set(("jabAttack3" + this.name).toLowerCase(),
					new Hitbox("JabAttack3" + this.name, this.pos.plus(new Vector2D(xPos, 0)), new Vector2D(1, 2), "null", true, 8, this, "enemy"));
			}

			if (this.actionFrame === 24) {
				this.action = null;
			}
		}
		else if (this.action === "aerialAttack" || this.action === "landingAttack") {

			if (this.actionFrame === 12) {
				let xPos: number;
				if (this.direction) { xPos = 1; }
				else { xPos = -1.5; }
				level.actors.set(("aerialAttack" + this.name).toLowerCase(),
					new Hitbox("AerialAttack" + this.name, this.pos.plus(new Vector2D(xPos, 0)), new Vector2D(1.25, 2), "null", true, 8, this, "enemy"));
			}

			if (this.actionFrame === 24) {
				this.action = null;
			}
		}
	}

	public crouch = (step: number, level: Level) => {
		if (this.input === "crouch") {
			this.size.y = 1.5;
			this.pos.y += 0.5;
		}
		if (!this.controls[5]) {
			this.action = null;
			this.size.y = 2;
			this.pos.y -= 0.5;
		}
	}

	public knockback = (step: number, level: Level): void => {
		if (this.size.y === 1.5) {
			this.size.y = 2;
			this.pos.y -= 0.5;
		}

		if (this.actionFrame === 0) {
			this.speed.y = -this.jumpSpeed;
		}
		if (this.direction) {
			this.speed.x = -this.xSpeed / 2;
		}
		else {
			this.speed.x = this.xSpeed / 2;
		}
		this.speed.y += step * this.gravity;

		var motion: Vector2D = this.speed.times(step);
		var newPos: Vector2D = this.pos.plus(motion);
		var obstacle: Bloc = level.obstacleAt(newPos, this.size);
		var wood: boolean = obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right");

		if (obstacle && !wood || obstacle && wood && this.pos.y + this.size.y < obstacle.pos.y || obstacle && wood && this.pos.y + this.size.y === obstacle.pos.y) {
			if (this.speed.y > 0) {
				this.speed.y = 0;
				this.pos.y = Math.round(this.pos.y * 10) / 10;
				if (this.pos.y % 0.5 !== 0) { this.pos.y = Math.round(this.pos.y) }
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
		if (this.actionFrame === 25) {
			this.speed = new Vector2D(0, 0);
			this.status = "invincible";
			this.invincibleFrame = 40;
			this.action = null;
		}
	}

	public talk = (step: number, level: Level) => {
		var actor = level.actorAt(this);
		if (actor && actor instanceof Npc) {
			if (level.messageBox1 === "" && level.messageBox2 !== actor.message) {
				level.messageBox1Actor = actor.name;
				level.messageBox1 = actor.message;
				level.messageTime1 = 0;
			}
			else if (level.messageBox1 !== actor.message && level.messageBox2 === "") {
				level.messageBox2Actor = actor.name;
				level.messageBox2 = actor.message;
				level.messageTime2 = 0;
			}
		}
		this.action = null;
	}

	public act = (step: number, level: Level, keys: Map<string, boolean>): void => {
		this.controls = [
			keys.get("a"),
			keys.get("b"),
			keys.get("left"),
			keys.get("right"),
			keys.get("up"),
			keys.get("down")
		];

		var actor = level.actorAt(this);

		if (this.status === null && actor && ((actor instanceof Enemy && actor.status === null) || actor instanceof Projectile)) {
			if (actor instanceof Projectile || !(this.action === "jabAttack1" || this.action === "jabAttack2" || this.action === "jabAttack3" || this.action === "aerialAttack" || this.action === "landingAttack" &&
				(this.direction && this.pos.x < actor.pos.x) || (!this.direction && this.pos.x + this.size.x > actor.pos.x + actor.size.x))) {	
				this.status = "stagger";
				this.actionFrame = 0;
				this.health--;
				
			    level.vfx.set(("vfx1" + level.frame).toLowerCase(),
                    new Vfx("vfx1" + level.frame, this.pos.plus(new Vector2D(this.size.x/2 - 1, this.size.y/2 -1)), new Vector2D(2, 2), this.direction, "vfx1", 16));
			}
		}

		if (this.size.y === 1.5 && this.action !== "crouch") {
			this.size.y = 2;
			this.pos.y -= 0.5;
		}

		var edgePos: Vector2D;
		if (this.direction) { edgePos = this.pos.plus(new Vector2D(this.size.x + 0.25, 0.25)); }
		else { edgePos = this.pos.plus(new Vector2D(-0.25, 0.25)); }
		var edge: Bloc = level.obstacleAt(edgePos, new Vector2D(0, 0.125));
		var floor: Bloc = level.obstacleAt(this.pos.plus(new Vector2D(0, this.size.y)), new Vector2D(1, 1));
		var air: Bloc = level.obstacleAt(edgePos.plus(new Vector2D(0, -0.5)), new Vector2D(0, 0.25));
		var air2: Bloc = level.obstacleAt(this.pos, new Vector2D(1, 0.5));

		if (this.status === null || this.status === "invincible") {
			if (this.jumpFrame > 4 && edge && edge.fieldType !== "wood" && edge.fieldType !== "wood-left" && edge.fieldType !== "wood-right" &&
				!air && !air2 && !floor && this.action !== "grip" && this.action !== "aerialAttack" && this.controls[2] && !this.direction ||
				this.jumpFrame > 4 && edge && edge.fieldType !== "wood" && edge.fieldType !== "wood-left" && edge.fieldType !== "wood-right" &&
				!air && !air2 && !floor && this.action !== "grip" && this.action !== "aerialAttack" && this.controls[3] && this.direction) {
				this.action = "grip";
				this.speed.y = 0;
				this.pos.x = Math.round(this.pos.x);
				this.pos.y = Math.round(this.pos.y) - 0.25;
			}
			else if (this.controls[4] && !this.controlsMemory[4] && this.action === null && this.speed.y === 0 && actor && actor instanceof Npc) {
				this.input = "talk";
				this.action = "talk";
			}
			else if (!this.controls[0] && this.controls[1] && (this.action === null || this.action === "crouch") && !this.controlsMemory[1] && this.speed.y === 0) {
				this.input = "jabAttack1";
				this.action = "jabAttack1";
			}
			else if (this.action === "jabAttack1" && this.jab1Buffer && this.actionFrame === 20 && this.speed.y === 0) {
				this.input = "jabAttack2";
				this.action = "jabAttack2";
			}
			else if (this.action === "jabAttack2" && this.jab2Buffer && this.actionFrame === 24 && this.speed.y === 0) {
				this.input = "jabAttack3";
				this.action = "jabAttack3";
			}
			else if (this.controls[5] && this.action === null && this.speed.y === 0) {
				this.input = "crouch";
				this.action = "crouch";
			}
			else if (this.controls[0] && !this.controlsMemory[0] && this.speed.y === 0 && (this.action === null || this.action === "grip" || this.action === "crouch") &&
				((!floor && this.action === "grip") || (floor && floor.fieldType !== "wood" && floor.fieldType !== "wood-left" && floor.fieldType !== "wood-right") ||
					(!this.controls[5] && floor && (floor.fieldType === "wood" || floor.fieldType === "wood-left" || floor.fieldType === "wood-right"))) ||
				this.action === "grip" && this.controls[5]) {
				this.input = "jump";
				this.action = "jump";
			}
			else if (this.controls[1] && (this.action === null || this.action === "jump") && !this.controlsMemory[1] && this.speed.y !== 0) {
				this.input = "aerialAttack";
				this.action = "aerialAttack";
			}
			else if (this.action === "aerialAttack" && this.speed.y === 0) {
				this.action = "landingAttack";
			}

			if (this.action === null || this.action === "jump") {
				this.moveX(step, level);
				this.moveY(step, level);
			}
			else if (this.action === "talk") {
				this.talk(step, level);
			}
			else if (this.action === "crouch") {
				this.crouch(step, level);
				this.moveX(step, level);
				this.moveY(step, level);
			}
			else if (this.action === "jabAttack1" || this.action === "jabAttack2" || this.action === "jabAttack3") {
				this.attackMoveX(step, level);
				this.moveY(step, level);
				this.attack(step, level);
			}
			else if (this.action === "aerialAttack" || this.action === "landingAttack") {
				this.moveX(step, level);
				this.moveY(step, level);
				this.attack(step, level);
			}


			if (this.status === "invincible") {
				this.invincibleFrame--;

				if (this.invincibleFrame === 0) {
					this.status = null;
				}
			}
		}
		else if (this.status === "stagger") {
			this.knockback(step, level);
		}
		this.input = null;
		for (let i = 0; i < this.controls.length; i++) {
			this.controlsMemory[i] = this.controls[i];
		}
	}
}