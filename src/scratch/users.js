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

// https://scratch.mit.edu/users/USERNAME/projects/
// https://scratch.mit.edu/users/USERNAME/favorites/
// https://scratch.mit.edu/users/USERNAME/studios_following/
// https://scratch.mit.edu/users/USERNAME/studios/
// https://scratch.mit.edu/users/USERNAME/following/
// https://scratch.mit.edu/users/USERNAME/followers/
// https://scratch.mit.edu/users/USERNAME/


module.exports = {
  fetchUsersFromComments,
  userCommentsUrl,
  parseUsersFromComments,
};
