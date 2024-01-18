import {Rectangle} from "./Rectangle.js";

export class Container {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.rectangles = [];
        this.space = {
            bottom: 0,
            left: 0,
            width: this.width,
            height: this.height
        }
    }

    startPacking(rectangles) {
        rectangles.sort((a, b) => b.height * b.width - a.height * a.width);
        rectangles.forEach(rec => this.addRectangle(new Rectangle(rec.width, rec.height, rec.color, rec.initialOrder)));
        this.optimizePacking();
        this.optimizePacking();
        return {
            fullness: this.calculateFullness(),
            blockCoordinates: [
                ...this.rectangles
            ]
        }
    }

    optimizePacking() {
        this.rectangles.forEach((el) => {
            const lowerThen = this.rectangles.filter((rec) => {
                if (el.initialOrder !== rec.initialOrder) {
                    if (el.bottom >= rec.bottom + rec.height) {
                        for (let i = rec.left; i <= rec.left + rec.width; i++) {
                            if (i > el.left && i < el.left + el.width) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            })
            el.bottom = lowerThen.reduce((acc, rec) => Math.max(rec.bottom + rec.height, acc), 0);

            const leftThen = this.rectangles.filter((rec) => {
                if (el.initialOrder !== rec.initialOrder) {
                    if (el.left >= rec.left + rec.width) {
                        for (let i = rec.bottom; i <= rec.bottom + rec.height; i++) {
                            if (i > el.bottom && i < el.bottom + el.height) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            })
            el.left = leftThen.reduce((acc, rec) => Math.max(rec.left + rec.width, acc), 0);
        })
    }

    calculateFullness() {
        let rectWithSpaceArea = 0;
        for (let bottom = 0; bottom <= this.height; bottom++) {
            let maxWidth = 0;
            for (let rectangle of this.rectangles) {
                if (rectangle.bottom <= bottom && rectangle.bottom + rectangle.height > bottom) {
                    maxWidth = Math.max(rectangle.left + rectangle.width, maxWidth);
                }
            }
            rectWithSpaceArea += maxWidth;
        }

        const totalBlockArea = this.rectangles.reduce((total, block) => total + block.width * block.height, 0);
        const totalInternalArea = rectWithSpaceArea - totalBlockArea;

        return 1 - totalInternalArea/ rectWithSpaceArea;
    }

    addRectangle(rectangle) {
        let selectedSpace = this.selectSpace(this.space, rectangle)
        if (selectedSpace) {
            this.splitSpace(selectedSpace, rectangle)
            this.rectangles.push({
                ...rectangle,
                left: selectedSpace.left,
                bottom: selectedSpace.bottom
            });
        }
    }

    selectSpace(space, rectangle) {
        if (space.used)
            return this.selectSpace(space.right, rectangle) || this.selectSpace(space.top, rectangle);

        const fitsInWidth = rectangle.width <= space.width && rectangle.height <= space.height;
        const fitsInHeight = rectangle.height <= space.width && rectangle.width <= space.height;

        if (fitsInWidth && fitsInHeight) {
            if (rectangle.width > rectangle.height) {
                rectangle.rotate();
            }
        } else if (fitsInHeight) {
            rectangle.rotate();
        }

        return fitsInWidth || fitsInHeight ? space : null;
    }

    splitSpace(space, rectangle) {
        space.used = true;
        space.top = {
            left: space.left,
            bottom: space.bottom + rectangle.height,
            width: space.width,
            height: space.height - rectangle.height
        };
        space.right = {
            left: space.left + rectangle.width,
            bottom: space.bottom,
            width: space.width - rectangle.width,
            height: rectangle.height
        };
        return space
    }
}