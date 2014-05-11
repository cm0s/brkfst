angular.module('directives.ugEditableText', [
  'services.apiRestangularSrv'
])
  .directive('ugEditableText', function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'directives/ugEditableText/ugEditableText.html',
      scope: {
        text: '=model',
        onSave: '&',
        editMode: '=',
        clickable: '='
      },
      replace: true,
      link: function (scope, element, attrs) {
        var span = angular.element(element.children()[0]);
        var form = angular.element(element.children()[1]);
        var input = angular.element(element.children()[1][0]);

        scope.$on('ugEditableText-edit-text', function (event, data) {
          input[0].value = scope.text;
          startEdit();
        });

        if (scope.clickable) {
          span.bind('click', function (event) {
            input[0].value = scope.text;
            startEdit();
          });
        }

        function startEdit() {
          bindEditElements();
          setEdit(true);
          $timeout(function () {
            input[0].focus();
          });
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
          // In order to ensure $apply is not called while another $apply is in progress
          // ($timeout automatically call $apply at the end of the digest phase)
          $timeout(function () {
          });
        }

        function isEscape(event) {
          return event && event.keyCode === 27;
        }
      }
    };
  });