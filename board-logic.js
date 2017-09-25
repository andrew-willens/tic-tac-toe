var inARow = 1;
var row = cell.id[0];
var column = cell.id[1];
var cellIndex = ((row - 1) * 3) + (column - 1);

var cellsMatch = function(cell1, cell2) {
    return (
        (!!cell1 && !!cell1.innerText)
        &&
        (!!cell2 && !!cell2.innerText)
        &&
        cell1.innerText === cell2.innerText
    );
}

// check horizontal
// left to right
for (var i = cellIndex + 1; i < cellIndex + BoardConst.columns; i++) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}
// right to left
for (var i = cellIndex - 1; i > cellIndex - column; i--) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}

// check vertical
// top to bottom
for (var i = cellIndex + BoardConst.rows;
     i < board.length;
     i += BoardConst.rows
) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}
// bottom to top
for (var i = cellIndex - BoardConst.rows;
     i >= 0;
     i -= BoardConst.rows
) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}

// check diagonal
// bottom to top
var left = BoardConst.columns + 1;
var right = BoardConst.columns - 1;
for (var i = cellIndex - right; i >= 0; i -= right) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}
if (inARow >= 3) {
    BoardConst.congratulations(onMove);
    newGame();
    return;
}

for (var i = cellIndex - left; i > 0; i -= left) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}
if (inARow >= 3) {
    BoardConst.congratulations(onMove);
    newGame();
    return;
}


// top to bottom
left = BoardConst.columns - 1;
right = BoardConst.columns + 1;
for (var i = cellIndex + right; i < board.length; i += right) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}
if (inARow >= 3) {
    BoardConst.congratulations(onMove);
    newGame();
    return;
}

for (var i = cellIndex + left; i < board.length - 1; i += left) {
    inARow += cellsMatch(board[i], cell) ? 1 : 0;
}
if (inARow >= 3) {
    BoardConst.congratulations(onMove);
    newGame();
    return;
}