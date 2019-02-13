class Vector2D {
    constructor(x, y) {
        this.plus = (other) => {
            return new Vector2D(this.x + other.x, this.y + other.y);
        };
        this.times = (factor) => {
            return new Vector2D(this.x * factor, this.y * factor);
        };
        this.equals = (other) => {
            return this.x === other.x && this.y === other.y;
        };
        this.floor = () => {
            return new Vector2D(Math.floor(this.x), Math.floor(this.y));
        };
        this.x = x;
        this.y = y;
    }
}
