var arrowCodes = new Map([
    [37, "left"],
    [38, "up"],
    [39, "right"],
    [40, "down"],
    [87, "a"],
    [88, "b"]
]);
var trackKeys = (codes) => {
    var pressed = new Map();
    codes.forEach(code => { pressed.set(code, false); });
    var handler = (event) => {
        if (codes.get(event.keyCode) !== undefined) {
            var down = event.type === "keydown";
            pressed.set(codes.get(event.keyCode), down);
            event.preventDefault();
        }
    };
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
};
var arrows = trackKeys(arrowCodes);
var runAnimation = (game) => {
    var lastTime = null;
    var frame = (time) => {
        if (lastTime !== null) {
            var step = Math.min(time - lastTime, 100) / 1000;
            game.level.calculFrame(step, arrows);
            game.display.drawFrame(step);
        }
        lastTime = time;
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};
var runGame = () => {
    game.level = new Level(room01, room01Actors.set("player", new Player("Tyr", new Vector2D(2, 3), new Vector2D(1, 2), "player", true)));
    game.display = new CanvasDisplay(document.body, game.level);
    runAnimation(game);
};
var game = new Game();
var debug = true;
window.onload = () => {
    runGame();
};
