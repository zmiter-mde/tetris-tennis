(function() {

    'use strict';

    angular.module('tennisApp')
        .controller('FieldCtrl', FieldCtrl);

    FieldCtrl.$inject = ['FieldService'];

    function FieldCtrl(fieldService) {

        var vm = this;

        vm.start = start;

        fieldService.init();
        vm.field = fieldService.fieldModel.field;
        vm.startText = 'Start';

        function start() {
            fieldService.start();
        }

        function outputField() {
            var str = '';
            for (var i = 0; i < vm.size.height; ++i) {
                for (var j = 0; j < vm.size.width; ++j)
                    str += vm.field[i][j].val + ' ';
                console.log(str);
                str = '';
            }
        }
    }
})();
