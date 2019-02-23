class Enemy extends Actor {

    public speed: Vector2D = new Vector2D(0, 0);
    
    public input: string = null;
    public action: string = null;
    public actionFrame: number = 0;
    public frame: number = 0;

	public status: string = null;
	public maxHealth: number = 20;
    public health: number = 20;
    
    public xDirection: number = 0;
    public xSpeed: number = scale / 8;
	public jumpSpeed: number = scale / 2;
	public gravity: number = scale * 2;
    
    public controls: Array<boolean> = [false];

    constructor(name: string, pos: Vector2D, size: Vector2D, sprites: string, direction: boolean) {
        super(name, pos, size, sprites, direction);
    }

	public moveX = (step: number, level: Level): void => {
        this.speed.x = 0;

        if (this.controls[1] || this.controls[2]) {
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

		var motion: Vector2D = new Vector2D(this.speed.x * step, 0);
		var newPos: Vector2D = this.pos.plus(motion);
		var obstacle: Bloc = level.obstacleAt(newPos, this.size);

		if (!obstacle || obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right")) {
			this.pos = newPos;
		}
		this.pos.x = Math.round(this.pos.x * 100) / 100;
    }

	public moveY = (step: number, level: Level): void => {
        if (this.controls[1]) {
            this.speed.y = -this.jumpSpeed;
        }
        if (this.controls[2]) {
            this.speed.y *= 1.5;
        }

        this.speed.y += step * this.gravity;

		var motion: Vector2D = new Vector2D(0, this.speed.y * step);
		var newPos: Vector2D = this.pos.plus(motion);
		var obstacle: Bloc = level.obstacleAt(newPos, this.size);
        var wood: boolean = obstacle && (obstacle.fieldType === "wood" || obstacle.fieldType === "wood-left" || obstacle.fieldType === "wood-right");

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
    }

	public attack = (step: number, level: Level): void => {
        this.actionFrame++;

        if (this.input === "attack") {
			this.actionFrame = 0;
        }

        if (this.actionFrame === 40) {
            let pathX: number;
            if (this.direction) { pathX = 1; }
            else { pathX = -1; }
            level.actors.set("cog" + this.frame, new Projectile("Cog" + this.frame, this.pos.plus(new Vector2D(0.5, 0.5)), new Vector2D(0.5, 0.5), "cog", true, new Vector2D(pathX, 0)))
        }
        
		if (this.actionFrame === 60) {
			this.action = null;
		}
    }

    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {
		this.controls = [
			(this.frame % 200 === 0),
			(this.frame % 64 === 0),
			(this.frame % (64*3) === 0)
        ];
        
        if (level.actors.get("player").pos.x > this.pos.x) { this.direction = true; }
        else { this.direction = false; }

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

        this.input = null;
        this.frame++;
    }
}