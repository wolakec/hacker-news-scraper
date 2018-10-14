#!/usr/bin/env node
const minimist = require('minimist');
const hackernews = require('./hackernews.js');

const args = minimist(process.argv.slice(2));

const main = async () => {
  const n = args.posts;

  if (typeof n == 'undefined') {
    throw new Error("Please supply --posts argument, e.g: --posts 100");
  }

  if (!Number.isInteger(n)) {
    throw new Error("Posts argument must be an integer ");
  }

  if (n < 1 || n > 100) {
    throw new Error("Number of posts argument must be between 1 and 100");
  }

  const data = await hackernews.fetch(n);

  // Making our JSON a bit prettier
  console.log(JSON.stringify(data, null, 2));
}

main()
.then(() => {
  console.log("Execution complete");
  process.exit(0);
})
.catch((error) => {
  console.error(error);
  process.exit(1);
});
