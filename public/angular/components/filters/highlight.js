angular.module('filters.highlight', []).filter('highlight', function () {
  return function (text, search, caseSensitive) {
    if (search || angular.isNumber(search)) {
      text = text.toString();
      var searchSplitted = search.toString().split(' ');

      _.forEach(searchSplitted, function (search) {
        if (caseSensitive) {
          return text.split(search).join('<span class="ui-match">' + search + '</span>');
        } else {
          return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
        }
      });
    } else {
      return text;
    }
  };
});
