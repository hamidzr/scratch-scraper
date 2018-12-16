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

// search for projects
function requestProjects(opts) {// offset=0, query='*', mode) {
  const defaultOpts = {
    offset: 0,
    query: '*',
    model: undefined,
  };
  opts = {...defaultOpts, opts};

  let url = `https://api.scratch.mit.edu/explore/projects?limit=40&offset=${opts.offset}&language=en&q=${opts.query}`;
  if (opts.mode) url = url + `&mode=${opts.mode}`;
  return getRequest(url);
}

// grab project contents
function projectContents(projectId) {
  const url = `https://projects.scratch.mit.edu/internalapi/project/${projectId}/get`;
  return getRequest(url);
}

function remixTree(projectId) {
  return getRequest(`https://scratch.mit.edu/projects/${projectId}/remixtree/bare/`);
}


// user's shared projects https://scratch.mit.edu/users/andpeggy1j/projects/


if (require.main === module) {
  projectContents(269873985).then(console.log);
}


module.exports = {
  requestProjects,
  projectContents,
};
