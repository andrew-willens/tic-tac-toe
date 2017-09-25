const game = (function() {
    // constant
    const PlayersConst = {
        USER: {
            name: 'user',
            key: 'x',
            color: 'red'
        },
        HOUSE: {
            name: 'house',
            key: 'o',
            color: 'black',
            turnlength: 3000, // milliseconds
        }
    };
    const BoardConst = {
        rows: 3,
        columns: 3,
        diagonals: [],
        columnSelector: '.column-3',
    };



    // state
    let onMove = PlayersConst.USER;
    let board = [];



    // methods
    const newGame = function() {
        board = [].slice.call(
            document.querySelectorAll(BoardConst.columnSelector)
        );


        board.forEach(function(cell, index) {
            let row;
            if (index < BoardConst.rows) {
                row = 1;
            }
            else if (index < (BoardConst.rows * 2)) {
                row = 2;
            }
            else if (index < (BoardConst.rows * 3)) {
                row = 3;
            }

            let column;
            if ([0, 3, 6].indexOf(index) !== -1) {
                column = 1;
            }
            else if ([1, 4, 7].indexOf(index) !== -1) {
                column = 2;
            }
            else if ([2, 5, 8].indexOf(index) !== -1) {
                column = 3;
            }

            cell.innerHTML = "";
            cell.id = row.toString() + column.toString();
        });


        // build diagonals
        // topleft <-> bottomright
        var diagonal = BoardConst.columns + 1;
        var topleftToBottomright = [];
        for (var i = 0; i < board.length; i += diagonal) {
            topleftToBottomright.push(board[i]);
        }
        BoardConst.diagonals.push(topleftToBottomright);

        // topright <-> bottomleft
        diagonal = BoardConst.columns - 1;
        var toprightToBottomleft = [];
        for (var i = BoardConst.columns - 1; // start at end of first row
            i < board.length - diagonal;
            i += diagonal
        ) {
            toprightToBottomleft.push(board[i]);
        }
        BoardConst.diagonals.push(toprightToBottomleft);


        onMove = PlayersConst.USER;
    }

    function rickRoll() {
        window.location.href = 'http://www.tinyurl.com/2fcpre6';
    }

    function gameOver(player) {
        if(confirm('House wins. Play again?')) {
            newGame();
        } else {
            alert('Okay. Your loss.')
            rickRoll();
        };
    }

    function congratulations(player) {
        if (confirm('Congratulations, you won! Collect your prize?')) {
            rickRoll();
        } else {
            alert('Suit yourself...');
            newGame();
        };
    }

    const houseTurn = function() {
        onMove = PlayersConst.HOUSE;
        setTimeout(
            function() {
                const openCells = board.filter(function(cell) {
                    return !cell.innerText; // find available cells
                });

                if (openCells.length) {
                    // select random cell
                    let cell = openCells[
                        Math.floor(
                            Math.random() * (openCells.length - 1)
                        )
                    ];
                    selectCell(cell);
                }

                onMove = PlayersConst.USER;
            },
            Math.random() * PlayersConst.HOUSE.turnlength, // timeout
        );
    }

    const userTurn = function(event) {
        if (!board.length) {
            newGame();
        }
        if (onMove.name === PlayersConst.USER.name) {
            selectCell(event.target);
            houseTurn();
        }
        else {
            alert("It's not your turn!");
        }
    }

    const selectCell = function (cell) {
        cell.innerText = onMove.key;
        cell.style.color = onMove.color;
        checkForVictory(cell);
    };

    const checkForVictory = function(cell) {
        var inARow = 1;
        var row = cell.id[0];
        var column = cell.id[1];
        var cellIndex = ((row - 1) * 3) + (column - 1);

        function cellsMatch(cell1, cell2) {
            return (
                (!!cell1 && !!cell1.innerText)
                &&
                (!!cell2 && !!cell2.innerText)
                &&
                cell1.innerText === cell2.innerText
            );
        }

        function victory() {
            if (inARow > 2) {
                if (onMove.name === 'user') {
                    congratulations();
                }
                else if (onMove.name === 'house') {
                    gameOver();
                }
                newGame();
                return true;
            }
            return false;
        }

        // check horizontal
        // left to right
        for (var i = cellIndex + 1; i < cellIndex + BoardConst.columns; i++) {
            inARow += cellsMatch(board[i], cell) ? 1 : 0;
        }
        if ( victory() ) {
            if (onMove.name === 'house') {
                console.log( inARow );
            }
            return;
        }

        // right to left
        for (var i = cellIndex - 1; i > cellIndex - column; i--) {
            if (cellsMatch(board[i], cell)) {
                inARow++;
            } else {
                break;
            }
        }
        if ( victory() ) {
            if (onMove.name === 'house') {
                console.log( inARow );
            }
            return;
        }
        inARow = 1;


        // check vertical
        // top to bottom
        for (var i = cellIndex + BoardConst.rows;
             i < board.length;
             i += BoardConst.rows
        ) {
            inARow += cellsMatch(board[i], cell) ? 1 : 0;
        }
        if ( victory() ) {
            if (onMove.name === 'house') {
                console.log( inARow );
            }
            return;
        }

        // bottom to top
        for (var i = cellIndex - BoardConst.rows;
             i >= 0;
             i -= BoardConst.rows
        ) {
            inARow += cellsMatch(board[i], cell) ? 1 : 0;
        }
        if ( victory() ) {
            if (onMove.name === 'house') {
                console.log( inARow );
            }
            return;
        }
        inARow = 1;


        // check diagonals
        inARow = 0;
        for (var i = 0; i < BoardConst.diagonals.length; i++) {
            var diag = BoardConst.diagonals[i];

            var ids = diag.map(function(cell) {
                return cell.id;
            });
            if ( ids.indexOf(cell.id) === -1 ) {
                inARow = 0;
                continue;
            };

            for (var j = 0; j < diag.length; j++) {
                var diagCell = diag[j];

                inARow += diagCell.innerText === cell.innerText ? 1 : 0;
            }

            if ( victory() ) {
                return;
                if (onMove.name === 'house') {
                    console.log( inARow );
                }
            }
            inARow = 0;
        }
    }



    // interface
    return {
        start: newGame,
        userTurn: userTurn,
    };
})();
