export class Rectangle {
    constructor(width, height, color, initialOrder) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.initialOrder = initialOrder;
    }

    rotate() {
        [this.width, this.height] = [this.height, this.width];
    }
}