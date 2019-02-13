class Level {

	public size: Vector2D;
	public layer0 = new Map<string, Bloc>();
	public layer1 = new Map<string, Bloc>();
	public layer2 = new Map<string, Bloc>();

	public tileset: string = "img/textures/grass.png";

	public actors = new Map<string, Actor>();

	public messageBox1: string = "";
	public messageBox1Actor: string = "";
	public messageTime1: number = 0;
	public messageBox2: string = "";
	public messageBox2Actor: string = "";
	public messageTime2: number = 0;

	constructor(plan: Array<Array<string>>, actors: Map<string, Actor>) {
		this.actors = actors;

		this.size = new Vector2D(plan[1][0].length, plan[1].length);
		for (let x = 0; x < this.size.x; x++) {
			for (let y = 0; y < this.size.y; y++) {
				for (let i = 0; i < plan.length; i++) {
					var ch: string = plan[i][y][x];
					var size: Vector2D;
					var fieldType: string;
					if (ch === '0') { fieldType = "void"; size = new Vector2D(1, 1); }
					else if (ch === '1') { fieldType = "top-left"; size = new Vector2D(1, 1); }
					else if (ch === '2') { fieldType = "top"; size = new Vector2D(1, 1); }
					else if (ch === '3') { fieldType = "top-right"; size = new Vector2D(1, 1); }
					else if (ch === '4') { fieldType = "center-left"; size = new Vector2D(1, 1); }
					else if (ch === '5') { fieldType = "center"; size = new Vector2D(1, 1); }
					else if (ch === '6') { fieldType = "center-right"; size = new Vector2D(1, 1); }
					else if (ch === '7') { fieldType = "bottom-left"; size = new Vector2D(1, 1); }
					else if (ch === '8') { fieldType = "bottom"; size = new Vector2D(1, 1); }
					else if (ch === '9') { fieldType = "bottom-right"; size = new Vector2D(1, 1); }
					else if (ch === 'a') { fieldType = "top-left-corner"; size = new Vector2D(1, 1); }
					else if (ch === 'b') { fieldType = "top-right-corner"; size = new Vector2D(1, 1); }
					else if (ch === 'c') { fieldType = "bottom-left-corner"; size = new Vector2D(1, 1); }
					else if (ch === 'd') { fieldType = "bottom-right-corner"; size = new Vector2D(1, 1); }
					else if (ch === 'e') { fieldType = "animated1"; size = new Vector2D(1, 1); }
					else if (ch === 'f') { fieldType = "animated2"; size = new Vector2D(1, 1); }
					else if (ch === 'g') { fieldType = "animated3"; size = new Vector2D(1, 1); }

					if (ch !== ' ') {
						switch (i) {
							case 0: { this.layer0.set(x + ", " + y, new Bloc(fieldType, new Vector2D(x, y), size)); break; }
							case 1: { this.layer1.set(x + ", " + y, new Bloc(fieldType, new Vector2D(x, y), size)); break; }
							case 2: { this.layer2.set(x + ", " + y, new Bloc(fieldType, new Vector2D(x, y), size)); break; }
							default: { break; }
						}
					}
				}
			}
		}
	}

	public calculFrame = (step: number, keys: Map<string, boolean>): void => {
		while (step > 0) {
			var thisStep: number = Math.min(step, 0.5);
			this.act();
			this.actors.forEach((actor: Actor) => {
				actor.act(thisStep, this, keys);
			});
			step -= thisStep;
		}
	}

	public act = (): void => {
		if (this.messageBox1 !== "" && this.messageTime1 > this.messageBox1.length * 5 + 60) {
			this.messageTime1 = 0;
			this.messageBox1 = "";
		}
		else {
			this.messageTime1++;
		}
		if (this.messageBox2 !== "" && this.messageTime2 > this.messageBox2.length * 5 + 60) {
			this.messageTime2 = 0;
			this.messageBox2 = "";
		}
		else {
			this.messageTime2++;
		}
	}

	public obstacleAt = (pos: Vector2D, size: Vector2D): Bloc => {
		var xStart: number = Math.floor(pos.x);
		var xEnd: number = Math.ceil(pos.x + size.x);
		var yStart: number = Math.floor(pos.y);
		var yEnd: number = Math.ceil(pos.y + size.y);

		if (xStart < 0) { return new Bloc("void", new Vector2D(pos.x, pos.y), new Vector2D(1, 1)); }
		if (xEnd > this.size.x) { return new Bloc("void", new Vector2D(pos.x, pos.y), new Vector2D(1, 1)); }
		if (yStart < 0) { return new Bloc("void", new Vector2D(pos.x, pos.y), new Vector2D(1, 1)); }
		if (yEnd > this.size.y) { return new Bloc("void", new Vector2D(pos.x, pos.y), new Vector2D(1, 1)); }
		
		for (let x = xStart; x < xEnd; x++) {
			for (let y = yStart; y < yEnd; y++) {
				var bloc: Bloc = this.layer1.get(x + ", " + y);
				if (bloc) {
					return bloc;
				}
			}
		}
	}
	
	public actorAt = (actor: Actor): Actor => {
		let xStart: number = actor.pos.x;
		let xEnd: number = actor.pos.x + actor.size.x;
		let yStart: number = actor.pos.y;
		let yEnd: number = actor.pos.y + actor.size.y;

		var result: Actor = null;
		this.actors.forEach((other: Actor) => {
			let otherXStart: number = other.pos.x;
			let otherXEnd: number = other.pos.x + other.size.x;
			let otherYStart: number = other.pos.y;
			let otherYEnd: number = other.pos.y + other.size.y;

			if (other !== actor && !(otherXStart > xEnd || otherXEnd < xStart || otherYStart > yEnd || otherYEnd < yStart)) {
				result = other;
			}
		});
		return result;
	}
}