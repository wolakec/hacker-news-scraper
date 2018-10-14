# hacker-news-scraper

This is a scraper for the popular website Hacker News. It scrapes the site
outputting post information in the form of JSON.

## Getting Started
Here are all the instructions you need to get up and running.

### Prerequisites
This project depends upon the following:
  - Node.js (https://nodejs.org) - Version 8 and above
  - Docker (https://www.docker.com/get-started) - Optional, only required to run using docker

### Installation
1. Clone the repository to your local machine
2. Navigate to the folder

Run the command:

```
npm install
```

If this had been pushed up as an npm package, you could simply install it by running "npm install package-name", however
since it is not on npm, you can simulate this behaviour by running:

```
npm link
```

You will now be able to run the hackernews command from anywhere on your machine. When you are done playing around
you can unlink by running:

```
npm unlink
```

### Running the script

To run the script execute the following command, providing the number of posts (positive integer between 1 and 100)
you would like to fetch:

```
hackernews --posts 100
```

### Output Format

The output format is JSON, which will be outputted to STDOUT.

Here is a sample of the output:

```
[
  {
    "title": "Amazon increases minimum wage for all U.S. workers to $15 an hour",
    "uri": "https://techcrunch.com/2018/10/02/amazon-minimum-wage/",
    "author": "doppp",
    "points": 527,
    "comments": 416,
    "rank": 1
  },
  {
    "title": "A History of .NET Runtimes",
    "uri": "http://mattwarren.org/2018/10/02/A-History-of-.NET-Runtimes/",
    "author": "edroche",
    "points": 104,
    "comments": 27,
    "rank": 2
  }
]
```

### Running using docker
Run the following command in the root directory:
```
docker build -t hackernews .
```

After the image has been built, run the following command, providing an argument for number of posts:
```
docker run hackernews --posts 100
```

## Dependencies

* [Minimist](https://github.com/substack/minimist) - This package helps out with parsing command line arguments
* [Axios](https://github.com/axios/axios) - HTTP client for making requests
* [Cheerio](https://github.com/cheeriojs/cheerio) - Allows us to parse HTML with a jQuery like API
* [Valid-Url](https://github.com/ogt/valid-url) - This allows us to check if URL's are valid
