var arrowCodes = new Map<number, string>([
    [37, "left"],
    [38, "up"],
    [39, "right"],
    [40, "down"],
    [87, "a"],
    [88, "b"]
]);

var trackKeys = (codes: Map<number, string>): Map<string, boolean> => {
    var pressed = new Map<string, boolean>();
    codes.forEach(code => { pressed.set(code, false); });
    var handler = (event: KeyboardEvent): void => {
        if (codes.get(event.keyCode) !== undefined) {
            var down: boolean = event.type === "keydown";
            pressed.set(codes.get(event.keyCode), down);
            event.preventDefault();
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

var arrows: Map<string, boolean> = trackKeys(arrowCodes);

var runAnimation = (game: Game): void => {
    var lastTime: number = null;
    var frame = (time: number): void => {
        if (lastTime !== null) {
            var step: number = Math.min(time - lastTime, 100) / 1000;
            game.level.calculFrame(step, arrows);
            game.display.drawFrame(step);
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

var runGame = (): void => {
    game.level = new Level(room02, room02Actors.set("player", new Player("Tyr", new Vector2D(4, 13), new Vector2D(1, 2), "player", true)));
    game.display = new CanvasDisplay(document.body, game.level);
    runAnimation(game);
}

var game: Game = new Game();

var debug: boolean = false;
window.onload = (): void => {
    runGame();
};