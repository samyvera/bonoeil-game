class Game {
    constructor() {
        this.changeLevel = (level, newPos, direction) => {
            let player = game.level.actors.get("player");
            this.level = level;
            if (player instanceof Player) {
                player.pos.x = newPos.x;
                player.speed.y = 0;
                player.direction = direction;
                this.level.actors.set("player", player);
            }
            this.display.level = level;
        };
    }
}
