class Vector {
    static add(array1, array2) {
        return Array.from(
            { length: Math.max(array1.length, array2.length) },
            (_, i) => array1[i] + array2[i]
        );
    }

    static equals(array1, array2) {
        let length = Math.max(array1.length, array2.length);
        for (let i = 0; i < length; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }
        return true;
    }
}


class Direction {
    static EAST = [1, 0];
    static WEST = [-1, 0];
    static NORTH = [0, 1];
    static SOUTH = [0, -1];

    static opposite(direction) {
        return {
            [Direction.EAST]: Direction.WEST,
            [Direction.WEST]: Direction.EAST,
            [Direction.NORTH]: Direction.SOUTH,
            [Direction.SOUTH]: Direction.NORTH,
        }[direction];
    }
}


class Domino {
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }

    static *getOccupiedCellPosition(domino) {
        if (Vector.equals(domino.direction, Direction.EAST) || Vector.equals(domino.direction, Direction.WEST)) {
            yield domino.position;
            yield Vector.add(domino.position, Direction.SOUTH);
        } else {
            yield domino.position;
            yield Vector.add(domino.position, Direction.WEST);
        }
    }
}


class AztecDiamond {
    constructor() {
        this.dominoesMap = new ArrayMap();
        this.order = 0;
    }

    incrementOrder() {
        this.order++;
    }

    moveDominoes() {
        const dominoes = [...this.dominoesMap.values()];
        for (const domino of dominoes) {
            this.dominoesMap.delete(domino.position);
        }
        for (const domino of dominoes) {
            domino.position = Vector.add(domino.position, domino.direction);
        }
        for (const domino of dominoes) {
            this.dominoesMap.set(domino.position, domino);
        }
    }

    deleteCollidingDominoes() {
        for (const [domino1, domino2] of [...this.getCollidingDominoes()]) {
            this.dominoesMap.delete(domino1.position);
            this.dominoesMap.delete(domino2.position);
        }
    }

    fillDominoes() {
        for (const position of [...this.getEmptySquarePositions()]) {
            if (Math.random() < 0.5) {
                this.dominoesMap.set(position, new Domino(position, Direction.EAST));
                const position2 = Vector.add(position, Direction.WEST);
                this.dominoesMap.set(position2, new Domino(position2, Direction.WEST));
            } else {
                this.dominoesMap.set(position, new Domino(position, Direction.NORTH));
                const position2 = Vector.add(position, Direction.SOUTH);
                this.dominoesMap.set(position2, new Domino(position2, Direction.SOUTH));
            }
        }
    }

    *getCollidingDominoes() {
        for (const domino1 of this.dominoesMap.values()) {
            const domino2 = this.dominoesMap.get(Vector.add(domino1.position, domino1.direction));
            if (domino2 && Vector.equals(domino2.direction, Direction.opposite(domino1.direction))) {
                yield [domino1, domino2];
            }
        }
    }

    *getEmptySquarePositions() {
        // Define a square region
        const square = [
            [0, 0],
            [-1, 0],
            [0, -1],
            [-1, -1],
        ];
        function* getSquareCells(position) {
            for (const squarePosition of square) {
                yield Vector.add(position, squarePosition);
            }
        }

        // Initialize interior cell state as 0 (empty)
        const cellState = new ArrayMap();
        for (const position of this.getInteriorCellPositions()) {
            cellState.set(position, 0);
        }

        // Set 1 (occupied) if there is a domino on the cell
        for (const domino of this.dominoesMap.values()) {
            for (const position of Domino.getOccupiedCellPosition(domino)) {
                cellState.set(position, 1);
            }
        }

        // Test if can fit a square
        function canFitSquare(position) {
            for (const squarePosition of getSquareCells(position)) {
                if (cellState.get(squarePosition) != 0) {
                    return false;
                }
            }
            return true;
        }
        for (const position of this.getInteriorCellPositions()) {
            if (canFitSquare(position)) {
                // Yield position and occupy the position
                yield position;
                for (const squarePosition of getSquareCells(position)) {
                    if (cellState.has(squarePosition)) {
                        cellState.set(squarePosition, 1);
                    }
                }
            }
        }
    }

    *getInteriorCellPositions() {
        for (let n = 1; n <= this.order; n++) {
            const x = this.order - n;
            for (let y = n - 1; y >= -n; y--) {
                yield [x, y];
            }
        }
        for (let n = this.order; n >= 1; n--) {
            const x = n - this.order - 1;
            for (let y = n - 1; y >= -n; y--) {
                yield [x, y];
            }
        }
    }
}
