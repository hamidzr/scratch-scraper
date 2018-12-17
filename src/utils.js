const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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

async function load(url) {
  let resp = await axios.get(url);
  let dom = new JSDOM(resp.data);
  // return cheerio.load(resp.data);
  return dom;
}

function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList, 0);
}

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })
}


module.exports = {
  getRequest,
  load,
  toArray,
  sleep,
};
