class Bloc {
    
    public fieldType: string;
    public pos: Vector2D;
    public size: Vector2D;

    constructor(fieldType: string, pos: Vector2D, size: Vector2D) {
        this.pos = pos;
        this.size = size;
        this.fieldType = fieldType;
    }
}