angular.module('appviewCtrl', [])
  .controller('ModalAppviewCtrl', function ($scope, $modal) {
    $scope.loadApp = function (app) {
      //Depending on the app type we open it in the appview or in a new browser window
      switch (app.appType.name) {
        case 'swapp' :
          $scope.app = {
            title: app.title,
            url: app.url,
            imageFileName: app.imageFileName
          }
          openModal();
          break;
        default :
          window.open(app.url, '_blank');
      }
    };

    var openModal = function () {
      var modalInstance = $modal.open({
        templateUrl: 'appview/appview.html',
        controller: 'ModalAppviewInstanceCtrl',
        windowClass: 'appview-modal',
        resolve: {
          app: function () {
            return $scope.app;
          }
        }
      });
    };
  })
  .controller('ModalAppviewInstanceCtrl', function ($scope, $modalInstance, app) {
    $scope.app = app;
  })
