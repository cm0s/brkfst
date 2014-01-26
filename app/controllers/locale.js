/**
 * URI used to return the client locale files in JSON format
 * language code must be passed by the [lang] query parameter.
 * This URI is used by the angular-translate module.
 */
exports.render = function (req, res) {
  var lang = req.query.lang;
  res.sendfile('public/angular/locales/' + lang + '.json');
};