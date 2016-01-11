(function() {
    'use strict'

    angular
        .module('tennisApp')
        .service('FieldModel', FieldModel);

    FieldModel.$inject = ['Constants']

    function FieldModel(C) {
        var vm = this;
        vm.field = null;

        vm.createField = createField;

        function createField() {
            var field = [];
            for (var i = 0; i < 34; ++i) {
                field[i] = [];
                for (var j = 0; j < 25; ++j) {
                    field[i][j] = { val: C.LUNG[i][j] };
                    field[i][50 - j - 1] = { val: C.LUNG[i][j] };
                }
            }

            for (var i = 34; i < 44; ++i) {
                field[i] = [];
                for (var j = 0; j < 50; ++j) {
                    field[i][j] = { val: 0 };
                }
            }

            field[43][25] = { val: C.CELL_STATES.BALL };
            field[44] = [];
            var bottom = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 3, 3,
                3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            for (var i = 0; i < 50; ++i) {
                field[44][i] = { val: bottom[i] };
            }

            vm.field = field;
        }
    }
})();