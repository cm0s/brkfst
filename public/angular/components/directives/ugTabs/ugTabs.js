angular.module('directives.ugTabs', [])
  .directive('ugTabs', function () {
    return {
      restrict: 'E',
      link: function (scope, elm, attrs) {
        //TODO remove this ugly timeout!
        setTimeout(function () {
          var $elem = $(elm[0]);
          var $tabs = $($elem).tabs();
          var $tab_items = $('ul:first li', $tabs).droppable({
            accept: '.js-favgroup-apps-drop-container',
            hoverClass: 'ui-state-hover',
            drop: function (event, ui) {
              var $item = $(this);
              var $list = $($item.find('a').attr('href')).find('.connectedSortable');
              ui.draggable.hide('slow', function () {
                $(this).appendTo($list).show('slow');
              });
            }
          });
        }, 500);
      }
    };
  });
