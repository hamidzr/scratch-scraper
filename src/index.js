const yaml = require('js-yaml'),
  scratchProjects = require('./scratch/projects'),
  fs = require('fs');


async function grabAll() {
  const perPage = 40;
  let curOffset = 0;
  let projects = [];

  // request sequentially
  try {
    while (true) {
      let newProjects = await scratchProjects.requestProjects(curOffset);
      curOffset += perPage;
      projects.push(...newProjects);
      if (newProjects.length === 0) break;
      console.log(`grabbed ${newProjects.length} new projects. offset ${curOffset}`);
    }
  } catch (e) {
    console.error(e);
  }
  return projects;
}


grabAll()
  .then(projs => {
    console.log('total projects:', projs.length);
    fs.writeFileSync(__dirname + '/projects.yaml', yaml.safeDump(projs))
  })
