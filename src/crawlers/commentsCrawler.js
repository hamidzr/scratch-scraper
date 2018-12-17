// crawls comments for usernames
const { parseUsersFromComments, userCommentsUrl } = require('../scratch/users');
const logger = require('../logger').fork('crawler:comments');
const Crawler = require('./crawler');

const userStore = new Set();

const pageParser = function(dom) {
  let users = parseUsersFromComments(dom);
  users.forEach(u => userStore.add(u));
  let newUrls = users.map(u => userCommentsUrl(u));
  return newUrls;
};

const crawler = new Crawler({pageParser})
const startUrls = ['ScratchCat'].map(user => userCommentsUrl(user));

crawler.start(startUrls);

// write to disk every once in a while
// TODO write a persistance strategy to appends newly found users to disk


// TODO crawl projects' comments
