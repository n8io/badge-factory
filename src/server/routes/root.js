const express = require('express');

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/', get)
    ;

  app.use('/', router);
};

function get(req, res) {
  const opts = {
    badgeRoute: {
      url: '/badge/:text.svg',
      routeParams: {
        text: 'The text to show up in the badge. E.g. Cheezeburgerz'
      },
      example: '/badge/Cheezeburgerz.svg'
    },
    queryStringOptions: {
      bg: 'The background color. E.g. 000000',
      fg: 'The foreground color. E.g. FFFFFF',
      hPad: 'The horizontal padding (left/right) in pixels of the badge text relative to the bounding rectangle. E.g. 5',
      vPad: 'The vertical padding (top/bottom) in pixels of the badge text relative to the bounding rectangle. E.g. 3',
      fsize: 'The font size in pixels. Defaults to 14',
      br: 'The border radius in pixels of the badge. Defaults to 3',
      bold: 'Whether or not to bold the text of the badge. E.g, Any truthy value enables it',
      ff: 'The font family of the presented text. E.g. it can be a comma delimited list for fallbacks... Curlz, WingDings, Arial'
    }
  };

  return res
    .status(200)
    .render('home', {options: opts})
    ;
}
