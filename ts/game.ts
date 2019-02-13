class Game {

    public level: Level;
    public display: CanvasDisplay;

    public changeLevel = (level: Level, newPos: Vector2D, direction: boolean) => {
        let player = game.level.actors.get("player");
        this.level = level;
        if (player instanceof Player) {
            player.pos.x = newPos.x;
            player.speed.y = 0;
            player.direction = direction;
            this.level.actors.set("player", player);
        }
        this.display.level = level;
    }
}