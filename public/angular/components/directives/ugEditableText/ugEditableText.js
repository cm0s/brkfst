angular.module('directives.ugEditableText', [
    'services.apiRestangularSrv'
  ])
  .directive('ugEditableText', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/ugEditableText/ugEditableText.html',
      scope: {
        text: '=model',
        onSave: '&'
      },
      replace: true,
      link: function (scope, element, attrs) {
        var span = angular.element(element.children()[0]);
        var form = angular.element(element.children()[1]);
        var input = angular.element(element.children()[1][0]);

        span.bind('click', function (event) {
          input[0].value = scope.text;
          startEdit();
        });

        function startEdit() {
          bindEditElements();
          setEdit(true);
          input[0].focus();
        }

        function bindEditElements() {
          input.bind('blur', function () {
            if (input[0].value) {
              save();
            }
            stopEdit();
          });

          input.bind('keyup', function (event) {
            if (isEscape(event)) {
              stopEdit();
            }
          });

          form.bind('submit', function () {
            if (input[0].value) {
              save();
            }
            stopEdit();
          });
        }

        function save() {
          scope.text = input[0].value;
          scope.$apply();
          scope.onSave();
        }

        function stopEdit() {
          unbindEditElements();
          setEdit(false);
        }

        function unbindEditElements() {
          input.unbind();
          form.unbind();
        }

        function setEdit(value) {
          scope.editing = value;
          scope.$apply();
        }

        function isEscape(event) {
          return event && event.keyCode === 27;
        }
      }
    };
  });