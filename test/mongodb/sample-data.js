db.apps.remove();
db.appCategories.remove();


/**
 * AppCategory
 */
var appCategory1Id = ObjectId(),
  appCategory2Id = ObjectId();

db.appCategories.insert({
    _id: appCategory1Id,
    title: 'Nice and fun'
  },
  {
    _id: appCategory2Id,
    title: 'Real stuff'
  });

/**
 * App
 */
db.apps.insert({
  'title': 'My Rocket App',
  'url': 'http://www.google.com',
  icon: {
    url: 'img/icons/rocket-icon.svg'
  },
  categories:[
    appCategory1Id,appCategory2Id
  ]
});

db.apps.insert({
  'title': 'Phone2me',
  'url': 'http://www.google.com',
  icon: {
    url: 'img/icons/phone-icon.svg'
  },
  categories:[
    appCategory2Id
  ]
});

db.apps.insert({
  'title': 'Audio App',
  'url': 'http://www.google.com',
  icon: {
    url: 'img/icons/headphones-icon.svg'
  },
  categories:[
    appCategory1Id
  ]
});

db.apps.insert({
  'title': 'Calendar',
  'url': 'http://www.google.com',
  icon: {
    url: 'img/icons/calendar-icon.svg'
  },
  categories:[
    appCategory2Id
  ]
});