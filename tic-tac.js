var game = (function() {
    // constant
    var PlayersConstant = {
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
    var BoardConstant = {
        winners: [],
        vertices: [],
        dimension: 3,
        selector: '.column-3',
    };



    // state
    var onMove = PlayersConstant.USER;



    // methods
    function newGame() {
        BoardConstant.vertices = [].slice.call(
            document.querySelectorAll(BoardConstant.selector)
        );

        BoardConstant.vertices.forEach(function(vertex, index) {
            vertex.id = index;
            vertex.innerHTML = "";
        });

        findWinners();

        onMove = PlayersConstant.USER;
    }

    function findWinners() {
        // horizontals
        for (var i = 0; i < BoardConstant.vertices.length; i += BoardConstant.dimension) {
            var winner = [];
            for (var j = 0; j < BoardConstant.dimension; j++) {
                winner.push(i+j);
            }

            BoardConstant.winners.push(winner);
        }

        // verticals
        for (var i = 0; i < BoardConstant.dimension; i++) {
            var winner = [];
            for (var j = i; j < BoardConstant.vertices.length; j+=BoardConstant.dimension) {
                winner.push(j);
            }

            BoardConstant.winners.push(winner);
        }

        // diagonals
        // find top corners: first vertex, last vertex of first row
        var topLeftCorner = 0;
        var topRightCorner = BoardConstant.dimension - 1;

        var winner = [];
        for (var i = topLeftCorner;
             i < BoardConstant.vertices.length;
             i+=(BoardConstant.dimension+1)
        ) {
            winner.push(i);
        }
        BoardConstant.winners.push(winner);

        winner = [];
        for (var i = topRightCorner;
             i <= BoardConstant.vertices.length - BoardConstant.dimension;
             i += (BoardConstant.dimension-1)
        ) {
            winner.push(i);
        }
        BoardConstant.winners.push(winner);
    }

    function reward(url) {
        window.location.href = 'http://www.tinyurl.com/' + [
            'nr626f3', 'ydaoab47', 'y8tp8lg4', 'ydaoab47',
            'ydhywcoc', 'ydybrw7k', 'y9t9lveu', 'y97l7wle',
            'onh3g87', '2fcpre6', 'n9gx2wo', 'a4bpo5s', 'm8qnree',
        ][Math.floor(Math.random() * prizes.length)];
    }

    function rick() {
        window.location = 'http://www.tinyurl.com/2fcpre6';
    }

    function draw() {
        if(confirm('Draw. Play again?')) {
            newGame();
        } else {
            alert('Okay. Your loss.')
            rick();
        };
    }

    function gameOver(player) {
        if(confirm('House wins. Play again?')) {
            newGame();
        } else {
            alert('Okay. Your loss.')
            rick();
        };
    }

    function congratulations(player) {
        if (confirm('Congratulations, you won! Collect your prize?')) {
            reward();
        } else {
            alert('Suit yourself...');
            newGame();
        };
    }

    function checkForVictory(vertex) {

        function vertexsMatch(vertex1, vertex2) {
            return (
                (!!vertex1 && !!vertex1.innerText)
                &&
                (!!vertex2 && !!vertex2.innerText)
                &&
                vertex1.innerText === vertex2.innerText
            );
        }

        for (var i = 0; i < BoardConstant.winners.length; i++) {
            var winner = BoardConstant.winners[i];


            var victory = true;
            if ( winner.indexOf(parseInt(vertex.id)) !== -1) {
                for (var j = 0; j < winner.length; j++) {
                    if ( !vertexsMatch(BoardConstant.vertices[winner[j]], vertex) ) {
                        victory = false;
                        break;
                    }
                }
            } else {
                continue;
            }


            if (victory &&
                onMove.name === PlayersConstant.USER.name
            ) {
                congratulations();
            }
            if (victory &&
                onMove.name === PlayersConstant.HOUSE.name
            ) {
                gameOver();
            }
        }
    }

    function selectCell(vertex) {
        vertex.innerText = onMove.key;
        vertex.style.color = onMove.color;
        checkForVictory(vertex);
    };

    function houseTurn() {
        onMove = PlayersConstant.HOUSE;
        setTimeout(
            function() {
                var openCells = BoardConstant.vertices.filter(function(vertex) {
                    return !vertex.innerText; // find available vertexs
                });

                if (!!openCells.length) {
                    // select random vertex
                    var vertex = openCells[
                        Math.floor(
                            Math.random() * (openCells.length - 1)
                        )
                    ];
                    selectCell(vertex);
                }
                else {
                    draw();
                }

                onMove = PlayersConstant.USER;
            },
            Math.random() * PlayersConstant.HOUSE.turnlength, // timeout
        );
    }

    function userTurn(event) {
        if (!BoardConstant.vertices.length) {
            newGame();
        }
        if (onMove.name === PlayersConstant.USER.name) {
            selectCell(event.target);
            houseTurn();
        }
        else {
            alert("It's not your turn!");
        }
    }



    // interface
    return {
        start: newGame,
        userTurn: userTurn,
    };
})();
