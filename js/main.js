function GameOfLife(boardWidth, boardHeight, board) {
    this.width = boardWidth;
    this.height = boardHeight;
    this.board = board;
    this.boardItemSize = 20;
    this.boardLong = 0;
    this.cells = [];
    this.nexGenCells = [];
    this.nextGenCounter = 0;
    this.sizeX = this.height / this.boardItemSize;
    this.sizeY = this.width / this.boardItemSize;

    this.createBoard = function () {
        if (this.board.hasChildNodes()) {
            while (this.board.hasChildNodes()) {
                this.board.removeChild(this.board.firstElementChild);
            }
        }
        this.board.style.width = `${this.width}px`;
        this.board.style.height = `${this.height}px`;
        this.boardLong = (this.sizeY * this.sizeX);
        for (let i = 0; i < this.boardLong; i++) {
            let data = document.createElement("div");
            data.addEventListener("click", this.changeStateHandler);
            data.style.width = `${this.boardItemSize}px`;
            data.style.height = `${this.boardItemSize}px`;
            this.board.append(data);
            this.cells.push(data);
        }

    };
    // event listener callback
    this.changeStateHandler = function () {
        this.classList.toggle("live");
    };
    // get position in array by X and Y
    this.findCellByXY = function (x, y) {
        return x + (y * this.width / this.boardItemSize);
    };
    // seting state of cell
    this.setCellState = function (x, y, state) {
        if (state === true) {
            this.cells[this.findCellByXY(x, y)].classList.add("live");
        } else if (state === false) {
            this.cells[this.findCellByXY(x, y)].classList.remove("live");
        } else if (state === 1) {
            this.nexGenCells[this.findCellByXY(x, y)] = 1;
        } else if (state === 0) {
            this.nexGenCells[this.findCellByXY(x, y)] = 0;
        }
    };

    // dummy first glider
    this.firstGlider = function () {
        this.setCellState(20, 20, true);
        this.setCellState(21, 20, true);
        this.setCellState(22, 20, true);
        this.setCellState(20, 21, true);
        this.setCellState(21, 22, true);
    };

    // calculation of cell state in nex gen
    this.computeCellNextState = function (x, y) {
        let siblings = 0;
        let targets = [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1]
        ];
        targets.forEach(data => {
            if (this.cells[this.findCellByXY(...data)]) {
                if (this.cells[this.findCellByXY(...data)].classList.length) {
                    siblings++
                }
            }
        });
        if (this.cells[this.findCellByXY(x, y)].classList.length === 1 && siblings < 2) {
            return false
        } else if (this.cells[this.findCellByXY(x, y)].classList.length === 1 && siblings >= 2 && siblings <= 3) {
            return true
        } else return this.cells[this.findCellByXY(x, y)].classList.length === 0 && siblings === 3;
    };

    this.computeNextGeneration = function () {
        for (let i = 0; i < this.sizeY; i++) {
            for (let j = 0; j < this.sizeX; j++) {
                if (this.computeCellNextState(i, j)) {
                    this.setCellState(i, j, 1);
                } else {
                    this.setCellState(i, j, 0);
                }
            }
        }
    };

    this.printNextGeneration = function () {
        this.nextGenCounter++;
        for (let i = 0; i < this.sizeY * this.sizeX - 1; i++) {
            this.cells[i].classList.remove("live");
            if (this.nexGenCells[i] === 1) {
                this.cells[i].classList.add("live");
            }
        }
    };

    this.clearBoard = function () {
        this.nexGenCells = Array().fill(0);
        this.printNextGeneration();
        this.nextGenCounter = 0;
    };

    this.start = function () {
        this.nextGenCounter = 0;
        this.createBoard();
        this.firstGlider();
    };
}

function genCounterCalc(data, value) {
    data.innerText = value;
}

document.addEventListener("DOMContentLoaded", function () {

    let sizeX = document.getElementById("sizeX");
    let sizeY = document.getElementById("sizeY");
    sizeX.value = 800;
    sizeY.value = 600;
    const board = document.getElementById("board");
    const genCounter = document.getElementById("genCounter");
    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");
    const setSize = document.getElementById("setSize");
    const clearBoard = document.getElementById("clearBoard");

    let game = new GameOfLife(sizeX.value, sizeY.value, board);
    game.start();

    var start;
    var isAnimationON = false;

    playBtn.addEventListener("click", () => {
        if (isAnimationON === false) {
            start = setInterval(() => {
                game.computeNextGeneration();
                game.printNextGeneration();
                console.log(genCounter.innerText);
                genCounterCalc(genCounter, game.nextGenCounter);
            }, 500);
            isAnimationON = true;
        }
    });


    pauseBtn.addEventListener("click", () => {
        clearTimeout(start);
        isAnimationON = false;
    });


    clearBoard.addEventListener("click", () => {
        // clearTimeout(start);
        isAnimationON = false;
        clearTimeout(start);
        game.clearBoard();
        genCounter.innerText =0;
    });


    setSize.addEventListener("click", () => {
        sizeX = document.getElementById("sizeX");
        sizeY = document.getElementById("sizeY");
        clearTimeout(start);
        game = new GameOfLife(sizeX.value, sizeY.value, board);
        game.start();
        genCounterCalc(genCounter, game.nextGenCounter);
    })


});