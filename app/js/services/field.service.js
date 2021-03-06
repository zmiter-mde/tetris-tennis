(function() {
    'use strict'

    angular
        .module('tennisApp')
        .service('FieldService', FieldService);

    FieldService.$inject = ['FieldModel', 'Constants', '$interval'];

    function FieldService(fieldModel, C, $interval) {
        var vm = this;
        vm.fieldModel = fieldModel;

        vm.init = init;
        vm.start = start;
        vm.stop = stop;
        vm.moveCigaretteLeft = moveCigaretteLeft;
        vm.moveCigaretteRight = moveCigaretteRight;

        function moveCigaretteLeft() {
            if (vm.cigarettePos > C.BORDERS.LEFT_BORDER) {
                var field = vm.fieldModel.field, bottom = C.BORDERS.BOTTOM_BORDER;
                field[bottom][vm.cigarettePos - 1].val = C.CELL_STATES.FILTER;
                field[bottom][vm.cigarettePos + 1].val = C.CELL_STATES.PLATFORM;
                field[bottom][vm.cigarettePos + 7].val = C.CELL_STATES.EMPTY;
                --vm.cigarettePos;
            }
        }

        function moveCigaretteRight() {
            if (vm.cigarettePos + 7 < C.BORDERS.RIGHT_BORDER) {
                var field = vm.fieldModel.field, bottom = C.BORDERS.BOTTOM_BORDER;
                field[bottom][vm.cigarettePos].val = C.CELL_STATES.EMPTY;
                field[bottom][vm.cigarettePos + 2].val = C.CELL_STATES.FILTER;
                field[bottom][vm.cigarettePos + 8].val = C.CELL_STATES.PLATFORM;
                ++vm.cigarettePos;
            }
        }

        function init() {
            vm.direction = C.DIRECTIONS.TOP_RIGHT; // current ball direction
            vm.cigarettePos = 21; // current cigarette position on the floor
            vm.ballPos = { top: C.BALL_START.TOP, left: C.BALL_START.LEFT }; // current ball position from top left corner
            vm.fieldModel.createField(); // field
            vm.intervalId = null;
            vm.interval = C.INTERVAL;
            vm.score = 0;
            vm.gameOver = false;
        }

        function start() {
            console.log('Started moving');
            vm.intervalId = $interval(move, vm.interval);
        }

        function stop(gameOver) {
            console.log('Stopped moving');
            $interval.cancel(vm.intervalId);
            vm.intervalId = null;
            vm.gameOver = gameOver;
        }

        function move() {
            console.log(vm.ballPos);
            switch (vm.direction) {
                case C.DIRECTIONS.TOP_RIGHT:
                    moveTopRight();
                    break;
                case C.DIRECTIONS.TOP_LEFT:
                    moveTopLeft();
                    break;
                case C.DIRECTIONS.BOTTOM_LEFT:
                    moveBottomLeft();
                    break;
                case C.DIRECTIONS.BOTTOM_RIGHT:
                    moveBottomRight();
                    break;
                default:
                    console.log('Unknown direction');
                    break;
            }
        }

        function moveTopRight() {
            var field = vm.fieldModel.field;
            var pos = vm.ballPos;
            if (pos.top == C.BORDERS.TOP_BORDER || field[pos.top - 1][pos.left].val == C.CELL_STATES.CELL) {
                if (pos.left == C.BORDERS.RIGHT_BORDER || field[pos.top][pos.left + 1].val == C.CELL_STATES.CELL) {
                    vm.direction = C.DIRECTIONS.BOTTOM_LEFT;
                } else {
                    vm.direction = C.DIRECTIONS.BOTTOM_RIGHT;
                }
                deleteCells(C.DIRECTIONS.TOP_RIGHT, true);
            } else {
                if (pos.left == C.BORDERS.RIGHT_BORDER || field[pos.top][pos.left + 1].val == C.CELL_STATES.CELL) {
                    deleteCells(C.DIRECTIONS.TOP_RIGHT, true);
                    vm.direction = C.DIRECTIONS.TOP_LEFT;
                } else {
                    if (field[pos.top - 1][pos.left + 1].val == C.CELL_STATES.CELL) {
                        deleteCells(C.DIRECTIONS.TOP_RIGHT, false);
                        vm.direction = C.DIRECTIONS.BOTTOM_LEFT;
                    } else {
                        moveBall(C.DIRECTIONS.TOP_RIGHT);
                    }
                }
            }
        }

        function moveTopLeft() {
            var field = vm.fieldModel.field;
            var pos = vm.ballPos;
            if (pos.top == C.BORDERS.TOP_BORDER || field[pos.top - 1][pos.left].val == C.CELL_STATES.CELL) {
                if (pos.left == C.BORDERS.LEFT_BORDER || field[pos.top][pos.left - 1].val == C.CELL_STATES.CELL) {
                    vm.direction = C.DIRECTIONS.BOTTOM_RIGHT;
                } else {
                    vm.direction = C.DIRECTIONS.BOTTOM_LEFT;
                }
                deleteCells(C.DIRECTIONS.TOP_LEFT, true);
            } else {
                if (pos.left == C.BORDERS.LEFT_BORDER || field[pos.top][pos.left - 1].val == C.CELL_STATES.CELL) {
                    deleteCells(C.DIRECTIONS.TOP_LEFT, true);
                    vm.direction = C.DIRECTIONS.TOP_RIGHT;
                } else {
                    if (field[pos.top - 1][pos.left - 1].val == C.CELL_STATES.CELL) {
                        deleteCells(C.DIRECTIONS.TOP_LEFT, false);
                        vm.direction = C.DIRECTIONS.BOTTOM_RIGHT;
                    } else {
                        moveBall(C.DIRECTIONS.TOP_LEFT);
                    }
                }
            }
        }

        function moveBottomLeft() {
            var field = vm.fieldModel.field;
            var pos = vm.ballPos;
            if (!isEmpty(field[pos.top + 1][pos.left].val)) {
                if (pos.left == C.BORDERS.LEFT_BORDER || field[pos.top][pos.left - 1].val == C.CELL_STATES.CELL) {
                    vm.direction = C.DIRECTIONS.TOP_RIGHT;
                } else {
                    vm.direction = C.DIRECTIONS.TOP_LEFT;
                }
                deleteCells(C.DIRECTIONS.BOTTOM_LEFT, true);
            } else {
                if (pos.left == C.BORDERS.LEFT_BORDER || field[pos.top][pos.left - 1].val == C.CELL_STATES.CELL) {
                    deleteCells(C.DIRECTIONS.TOP_LEFT, true);
                    vm.direction = C.DIRECTIONS.BOTTOM_RIGHT;
                } else {
                    if (!isEmpty(field[pos.top + 1][pos.left - 1].val)) {
                        deleteCells(C.DIRECTIONS.BOTTOM_LEFT, false);
                        vm.direction = C.DIRECTIONS.TOP_RIGHT;
                    } else {
                        moveBall(C.DIRECTIONS.BOTTOM_LEFT);
                    }
                }
            }
        }

        function moveBottomRight() {
            var field = vm.fieldModel.field;
            var pos = vm.ballPos;
            if (!isEmpty(field[pos.top + 1][pos.left].val)) {
                if (pos.left == C.BORDERS.RIGHT_BORDER || field[pos.top][pos.left + 1].val == C.CELL_STATES.CELL) {
                    vm.direction = C.DIRECTIONS.TOP_LEFT;
                } else {
                    vm.direction = C.DIRECTIONS.TOP_RIGHT;
                }
                deleteCells(C.DIRECTIONS.BOTTOM_RIGHT, true);
            } else {
                if (pos.left == C.BORDERS.RIGHT_BORDER || field[pos.top][pos.left + 1].val == C.CELL_STATES.CELL) {
                    deleteCells(C.DIRECTIONS.BOTTOM_RIGHT, true);
                    vm.direction = C.DIRECTIONS.BOTTOM_LEFT;
                } else {
                    if (!isEmpty(field[pos.top + 1][pos.left + 1].val)) {
                        deleteCells(C.DIRECTIONS.BOTTOM_RIGHT, false);
                        vm.direction = C.DIRECTIONS.TOP_LEFT;
                    } else {
                        moveBall(C.DIRECTIONS.BOTTOM_RIGHT);
                    }
                }
            }
        }

        function isEmpty(cellValue) {
            return cellValue == C.CELL_STATES.EMPTY || cellValue == C.CELL_STATES.BROKEN;
        }

        function moveBall(direction) {
            vm.fieldModel.field[vm.ballPos.top][vm.ballPos.left].val = C.CELL_STATES.EMPTY;
            moveBallPos(direction);
            vm.fieldModel.field[vm.ballPos.top][vm.ballPos.left].val = C.CELL_STATES.BALL;
            console.log(vm.ballPos);
        }

        function moveBallPos(direction) {
            switch (direction) {
                case C.DIRECTIONS.TOP_RIGHT:
                    --vm.ballPos.top;
                    ++vm.ballPos.left;
                    break;
                case C.DIRECTIONS.TOP_LEFT:
                    --vm.ballPos.top;
                    --vm.ballPos.left;
                    break;
                case C.DIRECTIONS.BOTTOM_RIGHT:
                    ++vm.ballPos.top;
                    ++vm.ballPos.left;
                    break;
                case C.DIRECTIONS.BOTTOM_LEFT:
                    ++vm.ballPos.top;
                    --vm.ballPos.left;
                    break;
                default:
                    console.log('Wrong direction');
                    console.log(direction);
                    break;
            }
        }

        function deleteCells(direction, saveCorner) {
            if (saveCorner) {
                deleteBorderCells(direction);
            } else {
                deleteCornerCells(direction);
            }

        }

        function deleteBorderCells(direction) {
            switch (direction) {
                case C.DIRECTIONS.TOP_RIGHT:
                    deleteTop();
                    deleteRight();
                    break;
                case C.DIRECTIONS.TOP_LEFT:
                    deleteTop();
                    deleteLeft();
                    break;
                case C.DIRECTIONS.BOTTOM_RIGHT:
                    deleteBottom();
                    deleteRight();
                    break;
                case C.DIRECTIONS.BOTTOM_LEFT:
                    deleteBottom();
                    deleteLeft();
                    break;
                default:
                    console.log('Wrong direction');
                    console.log(direction);
                    break;
            }
        }

        function deleteCornerCells(direction) {
            switch (direction) {
                case C.DIRECTIONS.TOP_RIGHT:
                    deleteTopRight();
                    break;
                case C.DIRECTIONS.TOP_LEFT:
                    deleteTopLeft();
                    break;
                case C.DIRECTIONS.BOTTOM_RIGHT:
                    deleteBottomRight();
                    break;
                case C.DIRECTIONS.BOTTOM_LEFT:
                    deleteBottomLeft();
                    break;
                default:
                    console.log('Wrong direction');
                    console.log(direction);
                    break;
            }
        }

        function deleteTop() {
            if (vm.ballPos.top > C.BORDERS.TOP_BORDER) {
                vm.fieldModel.field[vm.ballPos.top - 1][vm.ballPos.left].val = C.CELL_STATES.EMPTY;
            }
        }

        function deleteRight() {
            if (vm.ballPos.left < C.BORDERS.RIGHT_BORDER) {
                vm.fieldModel.field[vm.ballPos.top][vm.ballPos.left + 1].val = C.CELL_STATES.EMPTY;
            }
        }

        function deleteBottom() {
            if (vm.ballPos.top < C.BORDERS.BOTTOM_BORDER &&
                vm.fieldModel.field[vm.ballPos.top + 1][vm.ballPos.left].val == C.CELL_STATES.CELL) {
                vm.fieldModel.field[vm.ballPos.top + 1][vm.ballPos.left].val = C.CELL_STATES.EMPTY;
            }
        }

        function deleteLeft() {
            if (vm.ballPos.left > C.BORDERS.LEFT_BORDER) {
                vm.fieldModel.field[vm.ballPos.top][vm.ballPos.left - 1].val = C.CELL_STATES.EMPTY;
            }
        }

        function deleteTopRight() {
            if (vm.ballPos.left < C.BORDERS.RIGHT_BORDER && vm.ballPos.top > C.BORDERS.TOP_BORDER) {
                vm.fieldModel.field[vm.ballPos.top - 1][vm.ballPos.left + 1].val = C.CELL_STATES.EMPTY;
            }
        }

        function deleteTopLeft() {
            if (vm.ballPos.left > C.BORDERS.LEFT_BORDER && vm.ballPos.top > C.BORDERS.TOP_BORDER) {
                vm.fieldModel.field[vm.ballPos.top - 1][vm.ballPos.left - 1].val = C.CELL_STATES.EMPTY;
            }
        }

        function deleteBottomLeft() {
            if (vm.ballPos.left > C.BORDERS.LEFT_BORDER &&
                vm.ballPos.top < C.BORDERS.BOTTOM_BORDER &&
                vm.fieldModel.field[vm.ballPos.top + 1][vm.ballPos.left - 1].val == C.CELL_STATES.CELL) {
                vm.fieldModel.field[vm.ballPos.top + 1][vm.ballPos.left - 1].val = C.CELL_STATES.EMPTY;
            }
        }

        function deleteBottomRight() {
            if (vm.ballPos.left < C.BORDERS.RIGHT_BORDER &&
                vm.ballPos.top < C.BORDERS.BOTTOM_BORDER &&
                vm.fieldModel.field[vm.ballPos.top + 1][vm.ballPos.left + 1].val == C.CELL_STATES.CELL) {
                vm.fieldModel.field[vm.ballPos.top + 1][vm.ballPos.left + 1].val = C.CELL_STATES.EMPTY;
            }
        }
    }
})();