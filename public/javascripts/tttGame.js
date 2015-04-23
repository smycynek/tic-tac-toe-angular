var tttNgAppModule = angular.module("tttNgApp", []);
var flatten = function(arr) {
    return arr.reduce(function(prev, curr) {
        return prev.concat(curr);
    }, []);
};

tttNgAppModule.controller("tttCtrl", function($scope) {

    $scope.tableIds = [
        ["0 0", "0 1", "0 2"],
        ["1 0", "1 1", "1 2"],
        ["2 0", "2 1", "2 2"]
    ];
    $scope.winner = undefined;
    $scope.player = "x";
    $scope.currentColor = "#f00";

    $scope.mainRender = function() {
      $scope.reset();
    };

    $scope.reset = function() {
        $scope.clearStyles();
        $scope.start();
    };

    $scope.start = function() {
        $scope.board = $scope.tttBoard();
        $scope.winner = undefined;
        $scope.xColor = "#f00";
        $scope.oColor = "#00f";
        $scope.player = "x";
        $scope.currentColor = $scope.xColor;
    };

    $scope.togglePlayer = function() {
        if ($scope.player == "x") {
            $scope.player = "o";
            $scope.currentColor = $scope.oColor;
        } else {
            $scope.player = "x";
            $scope.currentColor = $scope.xColor;
        }
    };


    $scope.clearStyles = function() {
        // alert(flatten($scope.tableIds));
        flatten($scope.tableIds).forEach(function(id) {
            var cell = document.getElementById(id);
            if (cell != null) {
             cell.style.backgroundColor = "#fff";
            }
        });
    };

    $scope.markCell = function(id) {
        var cell = document.getElementById(id);

        var vals = id.split(" ");
        try {
            $scope.winner = $scope.board.set(vals[0], vals[1], $scope.player);
            cell.style.backgroundColor = $scope.currentColor;
            $scope.togglePlayer();
        } catch (e) {
            alert(e);
        }
        if ($scope.winner != undefined)
            alert($scope.winner);
    };

    $scope.tttBoard = function() {
        //return function() {
        var m_data = [
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined]
        ];
        var invalidArgsMessage = "Invalid arguments";
        var dataAlreadySetMessage = "Data already set"

        var win = function(data) {
            var winner = undefined;
            var tally = {
                x: 0,
                o: 0,
                undefined: 0
            };
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
            winningTriples.forEach(function(element, index, array) {
                var allX = element.every(function(curr, idx, arr) {
                    //   console.log("isx: " + curr[0] + " " + curr[1]);
                    var theval = m_data[curr[0]][curr[1]];
                    // console.log("val " + theval);
                    var isX = (theval === 'x');
                    // console.log(isX);
                    return (isX);
                });
                if (allX) {
                    winner = 'x';
                    return;
                } else {
                    var allY = element.every(function(curr, idx, arr) {
                        var theval = m_data[curr[0]][curr[1]];
                        var isY = (theval === 'o');
                        //console.log(isY);
                        return (isY);
                    });
                    if (allY) {
                        winner = 'o';
                        return;
                    }
                }

            });
            return winner;
        };
        var valid = function(r, c, val) {
            if ((r < 0) || (r > 2) || (r === undefined) || (Number(r) == NaN))
                return false;
            if ((c < 0) || (c > 2) || (c === undefined) || (Number(c) == NaN))
                return false;
            if ((val !== undefined) && ((val !== 'x') && (val !== 'o')))
                return false;
            return true;

        }
        return {
            get: function(r, c) {
                if (!valid(r, c)) {
                    throw invalidArgsMessage;
                }
                return m_data[r][c];
            },
            set: function(r, c, val) {
                if (!valid(r, c, val))
                    throw invalidArgsMessage;
                if (m_data[r][c] !== undefined)
                    throw dataAlreadySetMessage;
                m_data[r][c] = val;
                var winner = win(m_data);
                return winner;

            },

            toStr: function() {
                return m_data[0][0] + "     " + m_data[0][1] + "     " + m_data[0][2] + "\n" + m_data[1][0] + "     " + m_data[1][1] + "     " + m_data[1][2] + "\n" + m_data[2][0] + "     " + m_data[2][1] + "     " + m_data[2][2];
            }

        };
        //};
    }
    $scope.board = $scope.tttBoard();

});
