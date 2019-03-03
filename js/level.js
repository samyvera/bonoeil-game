class Level {
    constructor(plan, actors) {
        this.frame = 0;
        this.layer0 = new Map();
        this.layer1 = new Map();
        this.layer2 = new Map();
        this.tileset = "img/textures/grass.png";
        this.actors = new Map();
        this.vfx = new Map();
        this.messageBox1 = "";
        this.messageBox1Actor = "";
        this.messageTime1 = 0;
        this.messageBox2 = "";
        this.messageBox2Actor = "";
        this.messageTime2 = 0;
        this.calculFrame = (step, keys) => {
            while (step > 0) {
                var thisStep = Math.min(step, 0.5);
                this.act();
                this.actors.forEach((actor) => { actor.act(thisStep, this, keys); });
                this.vfx.forEach((vfx) => { vfx.act(thisStep, this, keys); });
                step -= thisStep;
                this.frame++;
            }
        };
        this.act = () => {
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
        };
        this.obstacleAt = (pos, size) => {
            var xStart = Math.floor(pos.x);
            var xEnd = Math.ceil(pos.x + size.x);
            var yStart = Math.floor(pos.y);
            var yEnd = Math.ceil(pos.y + size.y);
            if (xStart < 0) {
                return null;
            }
            if (xEnd > this.size.x) {
                return null;
            }
            if (yStart < 0) {
                return null;
            }
            if (yEnd > this.size.y) {
                return null;
            }
            var blocBuffer = null;
            for (let x = xStart; x < xEnd; x++) {
                for (let y = yStart; y < yEnd; y++) {
                    var bloc = this.layer1.get(x + ", " + y);
                    if (bloc) {
                        if (bloc.fieldType === "wood" || bloc.fieldType === "wood-left" || bloc.fieldType === "wood-right") {
                            blocBuffer = bloc;
                        }
                        else {
                            return bloc;
                        }
                    }
                }
            }
            return blocBuffer;
        };
        this.actorAt = (actor) => {
            let xStart = actor.pos.x;
            let xEnd = actor.pos.x + actor.size.x;
            let yStart = actor.pos.y;
            let yEnd = actor.pos.y + actor.size.y;
            var result = null;
            this.actors.forEach((other) => {
                let otherXStart = other.pos.x;
                let otherXEnd = other.pos.x + other.size.x;
                let otherYStart = other.pos.y;
                let otherYEnd = other.pos.y + other.size.y;
                if (other !== actor && !(otherXStart > xEnd || otherXEnd < xStart || otherYStart > yEnd || otherYEnd < yStart)) {
                    result = other;
                }
            });
            return result;
        };
        this.filterActorAt = (actor, filter) => {
            let xStart = actor.pos.x;
            let xEnd = actor.pos.x + actor.size.x;
            let yStart = actor.pos.y;
            let yEnd = actor.pos.y + actor.size.y;
            var result = null;
            this.actors.forEach((other) => {
                let otherXStart = other.pos.x;
                let otherXEnd = other.pos.x + other.size.x;
                let otherYStart = other.pos.y;
                let otherYEnd = other.pos.y + other.size.y;
                if ("img/actors/" + filter + ".png" === other.sprites && other !== actor && !(otherXStart > xEnd || otherXEnd < xStart || otherYStart > yEnd || otherYEnd < yStart)) {
                    result = other;
                }
            });
            return result;
        };
        this.actors = actors;
        this.size = new Vector2D(plan[1][0].length, plan[1].length);
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                for (let i = 0; i < plan.length; i++) {
                    var ch = plan[i][y][x];
                    var size;
                    var fieldType;
                    if (ch === '0') {
                        fieldType = "void";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '1') {
                        fieldType = "top-left";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '2') {
                        fieldType = "top";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '3') {
                        fieldType = "top-right";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '4') {
                        fieldType = "center-left";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '5') {
                        fieldType = "center";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '6') {
                        fieldType = "center-right";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '7') {
                        fieldType = "bottom-left";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '8') {
                        fieldType = "bottom";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === '9') {
                        fieldType = "bottom-right";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'a') {
                        fieldType = "top-left-corner";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'b') {
                        fieldType = "top-right-corner";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'c') {
                        fieldType = "bottom-left-corner";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'd') {
                        fieldType = "bottom-right-corner";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'e') {
                        fieldType = "animated1";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'f') {
                        fieldType = "animated2";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'g') {
                        fieldType = "animated3";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'h') {
                        fieldType = "wood-left";
                        size = new Vector2D(1, 1);
                    }
                    else if (ch === 'i') {
                        fieldType = "wood";
                        size = new Vector2D(1, 0.5);
                    }
                    else if (ch === 'j') {
                        fieldType = "wood-right";
                        size = new Vector2D(1, 1);
                    }
                    if (ch !== ' ') {
                        switch (i) {
                            case 0: {
                                this.layer0.set(x + ", " + y, new Bloc(fieldType, new Vector2D(x, y), size));
                                break;
                            }
                            case 1: {
                                this.layer1.set(x + ", " + y, new Bloc(fieldType, new Vector2D(x, y), size));
                                break;
                            }
                            case 2: {
                                this.layer2.set(x + ", " + y, new Bloc(fieldType, new Vector2D(x, y), size));
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
