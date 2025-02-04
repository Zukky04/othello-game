document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const turnIndicator = document.getElementById("turn-indicator");
    const restartButton = document.getElementById("restart");

    const SIZE = 8;
    let boardState = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
    let currentPlayer = "black";

    // 初期配置
    boardState[3][3] = "white";
    boardState[4][4] = "white";
    boardState[3][4] = "black";
    boardState[4][3] = "black";

    // 盤面を描画
    function drawBoard() {
        board.innerHTML = "";
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                if (boardState[row][col]) {
                    cell.classList.add(boardState[row][col]);
                }
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", handleMove);
                board.appendChild(cell);
            }
        }
    }

    // 有効な手か判定（反転できるか）
    function isValidMove(row, col, player) {
        if (boardState[row][col] !== null) return false;
        const opponent = player === "black" ? "white" : "black";
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        for (const [dx, dy] of directions) {
            let x = row + dx;
            let y = col + dy;
            let foundOpponent = false;
            while (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
                if (boardState[x][y] === opponent) {
                    foundOpponent = true;
                } else if (boardState[x][y] === player) {
                    if (foundOpponent) return true;
                    else break;
                } else {
                    break;
                }
                x += dx;
                y += dy;
            }
        }
        return false;
    }

    // 石を置く
    function placePiece(row, col, player) {
        boardState[row][col] = player;
        flipPieces(row, col, player);
        currentPlayer = currentPlayer === "black" ? "white" : "black";
        turnIndicator.textContent = `${currentPlayer === "black" ? "プレイヤー" : "相手"}の番です`;
        drawBoard();
    }

    // 石を反転させる
    function flipPieces(row, col, player) {
        const opponent = player === "black" ? "white" : "black";
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        for (const [dx, dy] of directions) {
            let x = row + dx;
            let y = col + dy;
            let piecesToFlip = [];
            while (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
                if (boardState[x][y] === opponent) {
                    piecesToFlip.push([x, y]);
                } else if (boardState[x][y] === player) {
                    for (const [fx, fy] of piecesToFlip) {
                        boardState[fx][fy] = player;
                    }
                    break;
                } else {
                    break;
                }
                x += dx;
                y += dy;
            }
        }
    }

    // プレイヤーの手を処理
    function handleMove(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        if (isValidMove(row, col, currentPlayer)) {
            placePiece(row, col, currentPlayer);
        }
    }

    // ゲームをリスタート
    function restartGame() {
        boardState = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
        boardState[3][3] = "white";
        boardState[4][4] = "white";
        boardState[3][4] = "black";
        boardState[4][3] = "black";
        currentPlayer = "black";
        turnIndicator.textContent = "プレイヤーの番です";
        drawBoard();
    }

    restartButton.addEventListener("click", restartGame);
    drawBoard();
});