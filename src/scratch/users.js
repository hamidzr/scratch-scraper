// user related information

const { getRequest, load, toArray } = require('../utils');
const logger = require('../logger').fork('users');


function userMetadata(username) {
  return getRequest(`https://api.scratch.mit.edu/users/${username}`)
}

async function usersFromComments(username) {
  logger.trace('getting users from comments', username);
  let dom = await load(`https://scratch.mit.edu/site-api/comments/user/${username}/?page=1`);
  let users = dom.window.document.querySelectorAll('div.name a');
  users = toArray(users).map(uEl => uEl.textContent);
  return users;
}

// https://scratch.mit.edu/users/USERNAME/projects/
// https://scratch.mit.edu/users/USERNAME/favorites/
// https://scratch.mit.edu/users/USERNAME/studios_following/
// https://scratch.mit.edu/users/USERNAME/studios/
// https://scratch.mit.edu/users/USERNAME/following/
// https://scratch.mit.edu/users/USERNAME/followers/
// https://scratch.mit.edu/users/USERNAME/


module.exports = {
  usersFromComments,
};
