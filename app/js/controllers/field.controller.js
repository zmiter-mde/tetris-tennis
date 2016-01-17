(function() {

    'use strict';

    angular.module('tennisApp')
        .controller('FieldCtrl', FieldCtrl);

    FieldCtrl.$inject = ['FieldService'];

    function FieldCtrl(fieldService) {

        var vm = this;

        vm.start = start;
        vm.changeDirection = changeDirection;

        fieldService.init();
        vm.field = fieldService.fieldModel.field;
        vm.startText = 'Start';

        function start() {
            fieldService.start();
        }

        function changeDirection($event) {
            if ($event.keyCode === 65 || $event.keyCode === 37) {
                fieldService.moveCigaretteLeft();
            } else if ($event.keyCode === 68 || $event.keyCode === 39) {
                fieldService.moveCigaretteRight();
            } else {
                console.log("Wrong key. Use w, a, s, d)");
            }
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
