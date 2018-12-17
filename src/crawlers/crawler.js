// const osmosis = require('osmosis');
const fs = require('fs');
const logger = require('../logger').fork('crawler');
const { sleep, load } = require('../utils');


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

class Crawler {
  constructor(opts) {
    const defaultOpts = {
      reqBatch: 20,
      reqDelay: 300,
      logger: logger,
      // picksup the interesting values from the page and also returns the newly found links
      pageParser: undefined // might have a better place..
    };
    opts = {...defaultOpts, ...opts};

    if (!opts.pageParser) throw new Error('pageParser is required');

    this.pageParser = opts.pageParser;
    this.reqBatch = opts.reqBatch;
    this.reqDelay = opts.reqDelay;
    this.logger = logger;

    this._queue = []; // queue of discovered urls
    this._visited = {}; // keep track of visited urls
    this.crawledPages = 0;
  }

  isCrawled(url) {
    return this._visited[url] === true;
  }

  markCrawled(url) {
    this._visited[url] = true;
    this.crawledPages = this.crawledPages + 1;
  }

  _queueNewUrls(newUrls) {
    newUrls = newUrls.filter(url => !this.isCrawled(url));
    this._queue.push(...newUrls);
  }

  // picks atleast "count" urls from the head of the queue
  // best effort. changes the queue
  // OPT double checking for isCrawled
  _pickNewUrls(count) {
    let newUrls = this._queue.splice(0, count);
    newUrls = newUrls.filter(url => !this.isCrawled(url));
    while (newUrls.length < count && this._queue.length > count) {
      let url = this._queue.shift();
      if (!this.isCrawled(url)) newUrls.add(url); // OPT O(n) on every call
    }
    return newUrls;
  }

  // carwls a batch
  async crawl() {
    let urls = this._pickNewUrls(this.reqBatch);
    urls.forEach(async url => {
      try {
        this.markCrawled(); // not actually crawled yet..
        let resp = await load(url);
        const newUrls = this.pageParser(resp); // maybe return the values too?
        this._queueNewUrls(newUrls);
      } catch (e) {
        this.logger.error('error crawling', url);
      }
    })
  }


  _removeDuplicates(arr) {
    let initLen = arr.length;
    let newArr =  Array.from(new Set(arr));
    return newArr;
    // return [...new Set(arr)];
  }

  _cleanupQueue() {
    this._queue = this._removeDuplicates(this._queue);
  }



  async start(seedUrls) {
    this._queueNewUrls(seedUrls);

    // not the best way to cleanup..
    setInterval(() => {
      this._cleanupQueue();
    }, 3000)

    setInterval(() => {
      fs.writeFile(`queue-${Date.now()}.list`, this._queue.join('\n'), () => {});
      fs.writeFile(`visited-${Date.now()}.list`, Object.keys(this._visited).join('\n'), () => {});
    }, 30000)

    while (true) {
      this.crawl();
      await sleep(this.reqDelay)
      logger.log(`total visited: ${this.crawledPages} in queue: ${this._queue.length}`);
    }

  }

}

module.exports = Crawler;
