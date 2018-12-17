// user related information

const { getRequest, load, toArray } = require('../utils');
const logger = require('../logger').fork('users');


function userMetadata(username) {
  return getRequest(`https://api.scratch.mit.edu/users/${username}`)
}


function parseUsersFromComments(commentsPage) {
  let users = commentsPage.window.document.querySelectorAll('div.name a');
  users = toArray(users).map(uEl => uEl.textContent);
  return users;
}

function userCommentsUrl(username) {
  return `https://scratch.mit.edu/site-api/comments/user/${username}/?page=1`
}

// todo grab other pages, paginate
async function fetchUsersFromComments(username) {
  logger.trace('getting users from comments', username);
  let dom = await load(userCommentsUrl(username));
  return parseUsersFromComments(dom);
}


function parseUsersFromFollowers(followersDom) {
  let users = followersDom.window.document.querySelectorAll('ul li .title a');
  users = toArray(users).map(uEl => uEl.textContent.trim());
  return users;
}

// https://scratch.mit.edu/users/USERNAME/projects/
// https://scratch.mit.edu/users/USERNAME/favorites/
// https://scratch.mit.edu/users/USERNAME/studios_following/
// https://scratch.mit.edu/users/USERNAME/studios/
// https://scratch.mit.edu/users/USERNAME/following/
// https://scratch.mit.edu/users/USERNAME/followers/
// https://scratch.mit.edu/users/USERNAME/


if (require.main === module) {
  (async function() {
    console.log('called directly');
    let dom = await load('https://scratch.mit.edu/users/ScratchCat/followers/');
    let users = parseUsersFromFollowers(dom);
    console.log(users);
  }());
}

module.exports = {
  fetchUsersFromComments,
  userCommentsUrl,
  parseUsersFromComments,
};
