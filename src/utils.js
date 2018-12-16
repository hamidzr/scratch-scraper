const axios = require('axios');

function getRequest(url) {
  return axios({
    method: 'get',
    url,
    headers: {
      'origin': 'https://scratch.mit.edu',
      'accept-encoding': 'gzip, deflate, br',
      'accept': '*/*',
      'referer': 'https://scratch.mit.edu/explore/projects/all',
      'authority': 'api.scratch.mit.edu',
      'cache-control': 'no-cache',
    }
  })
    .then(res => res.data);
}


module.exports = {
  getRequest,
};
