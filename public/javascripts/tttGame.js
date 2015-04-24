/*global alert */
var tttNgAppModule = angular.module("tttNgApp", []);
var flatten = function (arr) {
    return arr.reduce(function (prev, curr) {
        return prev.concat(curr);
    }, []);
};

tttNgAppModule.controller("tttCtrl", function ($scope) {

    $scope.tableIds = [
        ["0 0", "0 1", "0 2"],
        ["1 0", "1 1", "1 2"],
        ["2 0", "2 1", "2 2"]
    ];
    $scope.winner = undefined;
    $scope.player = "x";
    $scope.currentColor = "#f00";

    $scope.mainRender = function () {
        $scope.reset();
    };

    $scope.reset = function () {
        $scope.clearStyles();
        $scope.start();
    };

    $scope.start = function () {
        $scope.board = $scope.tttBoard();
        $scope.winner = undefined;
        $scope.xColor = "#f00";
        $scope.oColor = "#00f";
        $scope.player = "x";
        $scope.currentColor = $scope.xColor;
    };

    $scope.togglePlayer = function () {
        if ($scope.player === "x") {
            $scope.player = "o";
            $scope.currentColor = $scope.oColor;
        } else {
            $scope.player = "x";
            $scope.currentColor = $scope.xColor;
        }
    };


    $scope.clearStyles = function () {
        // alert(flatten($scope.tableIds));
        flatten($scope.tableIds).forEach(function (id) {
            var cell = document.getElementById(id);
            if (cell !== null) {
                cell.style.backgroundColor = "#fff";
                cell.children[0].textContent = "";
            }
        });
    };

    $scope.markCell = function (id) {
        if ($scope.winner !== undefined) {
            alert("Game over, click 'Reset'.");
            return;
        }
        var cell = document.getElementById(id);

        var vals = id.split(" ");
        try {
            $scope.winner = $scope.board.set(vals[0], vals[1], $scope.player);
            cell.style.backgroundColor = $scope.currentColor;
            cell.children[0].textContent = $scope.player;
            $scope.togglePlayer();
        } catch (e) {
            alert(e);
        }
        if ($scope.winner !== undefined) {
            alert("Winner = " + $scope.winner);
        }
    };

    $scope.tttBoard = function () {
        //return function () {
        var m_data = [
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined]
        ];
        var invalidArgsMessage = "Invalid arguments";
        var dataAlreadySetMessage = "Data already set";

        var win = function (data) {
            var winningTriples = [
                [
                    [0, 0],
                    [0, 1],
                    [0, 2]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [1, 2]
                ],
                [
                    [2, 0],
                    [2, 1],
                    [2, 2]
                ],
                [
                    [0, 0],
                    [1, 0],
                    [2, 0]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [0, 2],
                    [1, 2],
                    [2, 2]
                ],
                [
                    [0, 0],
                    [1, 1],
                    [2, 2]
                ],
                [
                    [2, 0],
                    [1, 1],
                    [0, 2]
                ]
            ];

            var xWin = winningTriples.some(function (element) {
                return element.every(function (curr) {
                    return (data[curr[0]][curr[1]] === 'x');
                });
            });
            if (xWin) {
                return 'x';
            }
            var oWin = winningTriples.some(function (element) {
                return element.every(function (curr) {
                    return (data[curr[0]][curr[1]] === 'o');
                });
            });
            if (oWin) {
                return 'o';
            }
            var allCoords = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]; //replace with range
            var allSet = allCoords.every(function (curr) {
                var theval = data[curr[0]][curr[1]];
                return (theval !== undefined);
            });
            if (allSet) {
                return 'draw';
            }
            return undefined;
        };
        var valid = function (r, c, val) {
            if ((r < 0) || (r > 2) || (r === undefined) || (isNaN(r))) {
                return false;
            }
            if ((c < 0) || (c > 2) || (c === undefined) || (isNaN(c))) {
                return false;
            }
            if ((val !== undefined) && ((val !== 'x') && (val !== 'o'))) {
                return false;
            }
            return true;

        };
        return {
            get: function (r, c) {
                if (!valid(r, c)) {
                    throw invalidArgsMessage;
                }
                return m_data[r][c];
            },
            set: function (r, c, val) {
                if (!valid(r, c, val)) {
                    throw invalidArgsMessage;
                }
                if (m_data[r][c] !== undefined) {
                    throw dataAlreadySetMessage;
                }
                m_data[r][c] = val;
                var theWinner = win(m_data);
                return theWinner;

            },

            toStr: function () {
                return m_data[0][0] + "     " + m_data[0][1] + "     " + m_data[0][2] + "\n" + m_data[1][0] + "     " + m_data[1][1] + "     " + m_data[1][2] + "\n" + m_data[2][0] + "     " + m_data[2][1] + "     " + m_data[2][2];
            }

        };
    };
    $scope.board = $scope.tttBoard();
});
