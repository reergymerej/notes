'use strict';

/* Directives */


angular.module('myApp.directives', [])
  
  .directive('note', [function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directive-templates/note.html'
    };
  }])

  .directive('categories', [function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directive-templates/categories.html'
    }
  }])

  .directive('jgDeletable', [function () {
    return {
      restrict: 'A',
      transclude: true,
      templateUrl: 'views/directive-templates/jg-deletable.html',
      scope: {
        x: '=item',
        removeMethod: '='
      },
      controller: function ($scope) {
        $scope.remove = function (item, removeMethod) {
          removeMethod(item);
        };
      }
    }
  }]);