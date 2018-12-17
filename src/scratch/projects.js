const getRequest = require('../utils').getRequest;

// search for projects
function requestProjects(opts) {// offset=0, query='*', mode) {
  const defaultOpts = {
    offset: 0,
    query: '*',
    model: undefined, // recent, trending
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


// TODO projects in a studio(playlist): https://scratch.mit.edu/users/USERNAME/

// TODO project comments https://scratch.mit.edu/site-api/comments/project/PROJECTID/?page=1

// ajax https://scratch.mit.edu/site-api/projects/in/4328258/1/


if (require.main === module) {
  projectContents(269873985).then(console.log);
}


module.exports = {
  requestProjects,
  projectContents,
};
