// const osmosis = require('osmosis');
const fs = require('fs');
const logger = require('./logger').fork('crawler');
const { sleep } = require('./utils');
const { usersFromComments } = require('./scratch/users');


/*
username:
  comments: users
  shared projects: projects
  favorite projects, users
  studios: projects, users
  followers: users
projectId:
  project remixes: users, projects
  comments: users
*/

const userStore = new Set();
let  usernamesQ = []

const memory = {};

function isCrawled(type, variable) {
  if (memory[type] === undefined) {
    memory[type] = {};
  }
  if (memory[type][variable] === true) {
    return true;
  }
  return false
}

function markCrawled(type, variable) {
  memory[type][variable] = true;
}


async function consume(biteSize) {
  let chunk = usernamesQ.splice(0, biteSize);

  chunk = chunk.filter(username => !isCrawled('comments', username));
  // if (chunk.length < biteSize * 0.7) chunk = chunk.push(...usernamesQ.splice(0, biteSize));

  let promises = chunk.map(async username => {
    markCrawled('comments', username);
    try {
      let nextUsers = await usersFromComments(username);
      userStore.add(username);
      usernamesQ.push(...nextUsers);
    } catch (e) {
      logger.error('error scraping comments from', username);
    }
  })
  // res = await Promise.all(promises);
};


function removeDuplicates(arr) {
  let initLen = arr.length;
  let newArr =  Array.from(new Set(arr));
  logger.trace(`saved ${initLen - newArr.length}`);
  return newArr;
  // return [...new Set(arr)];
}

async function start() {
  usernamesQ.push('ScratchCat');

  setInterval(() => {
    usernamesQ = removeDuplicates(usernamesQ);
  }, 3000)

  setInterval(() => {
    fs.writeFile(`usernamesQ-${Date.now()}.list`, usernamesQ.join('\n'), () => logger.trace('finished writing'));
    fs.writeFile(`testedUsers-${Date.now()}.list`, Array.from(userStore).join('\n'), () => logger.trace('finished writing'));
  }, 30000)

  while (true) {
    consume(10);
    await sleep(300)
    logger.log('totalusers:', userStore.size);
    logger.log('queue:', usernamesQ.length);
  }

}

start();
