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
        dimension: 3,
        diagonals: [],
        winners: [],
        columnSelector: '.column-3',
    };



    // state
    let onMove = PlayersConst.USER;
    let board = [];



    // methods
    function newGame() {
        board = [].slice.call(
            document.querySelectorAll(BoardConst.columnSelector)
        );

        board.forEach(function(cell, index) {
            cell.id = index;
            cell.innerHTML = "";
        });

        findWinners();

        onMove = PlayersConst.USER;
    }

    function findWinners() {
        // horizontals
        for (var i = 0; i < board.length; i += BoardConst.dimension) {
            var winner = [];
            for (var j = 0; j < BoardConst.dimension; j++) {
                winner.push(i+j);
            }

            BoardConst.winners.push(winner);
        }

        // verticals
        for (var i = 0; i < BoardConst.dimension; i++) {
            var winner = [];
            for (var j = i; j < board.length; j+=BoardConst.dimension) {
                winner.push(j);
            }

            BoardConst.winners.push(winner);
        }

        // diagonals
        // find top corners: first vertex, last vertex of first row
        var topLeftCorner = 0;
        var topRightCorner = BoardConst.dimension - 1;

        var winner = [];
        for (var i = topLeftCorner;
             i < board.length;
             i+=(BoardConst.dimension+1)
        ) {
            winner.push(i);
        }
        BoardConst.winners.push(winner);

        winner = [];
        for (var i = topRightCorner;
             i <= board.length - BoardConst.dimension;
             i += (BoardConst.dimension-1)
        ) {
            winner.push(i);
        }
        BoardConst.winners.push(winner);
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

        function cellsMatch(cell1, cell2) {
            return (
                (!!cell1 && !!cell1.innerText)
                &&
                (!!cell2 && !!cell2.innerText)
                &&
                cell1.innerText === cell2.innerText
            );
        }

        for (var i = 0; i < BoardConst.winners.length; i++) {
            var winner = BoardConst.winners[i];


            var victory = true;
            if ( winner.indexOf(parseInt(cell.id)) !== -1) {
                for (var j = 0; j < winner.length; j++) {
                    if ( !cellsMatch(board[winner[j]], cell) ) {
                        victory = false;
                        break;
                    }
                }
            } else {
                continue;
            }


            if (victory &&
                onMove.name === PlayersConst.USER.name
            ) {
                congratulations();
            }
            if (victory &&
                onMove.name === PlayersConst.HOUSE.name
            ) {
                gameOver();
            }
        }
    }



    // interface
    return {
        start: newGame,
        userTurn: userTurn,
    };
})();
