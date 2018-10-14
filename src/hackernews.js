const axios = require('axios');
const cheerio = require('cheerio');
const validUrl = require('valid-url');

const BASE_URL = 'https://news.ycombinator.com/news';
const NO_PER_PAGE = 30;

const fetchData = (numberOfStories) => {
  // We sometimes need to make multiple requests
  // to fetch all the stories the user requests
  const pagesToFetch = calculatePages(numberOfStories);

  let pageRequests = [];
  for (let i = 1; i <= pagesToFetch; i++) {
    pageRequests.push(axios.get(BASE_URL + '?p=' + i));
  }

  return pageRequests;
}

const calculatePages = (n) => {
  return Math.ceil(n / NO_PER_PAGE);
}

const parseResponse = (response) => {
  const $ = cheerio.load(response, {decodeEntities: false });

  const parsedHeadlines = [];
  const stories = [];

  const headlineRow = $('.itemlist .athing');
  const dataRow = $('.itemlist tr').has('.age');

  // Parse first row which contains headline and link
  headlineRow.each(function (i, elem){
    const title = $(this).find('.storylink').html();
    const uri = $(this).find('.storylink').attr('href');
    const rank = formatRank($(this).find('.rank').html());

    parsedHeadlines.push({
      title: title,
      uri: uri,
      rank: rank
    })
  });

  // Parse row which contains story metadata
  dataRow.each(function (i, elem){
    const user = $(this).find('.hnuser').html();
    const score = formatScore($(this).find('.score').html());
    const comments = formatComments($(this).find('.subtext').children().last("a").html());

    stories.push({
      title: parsedHeadlines[i].title,
      uri: parsedHeadlines[i].uri,
      author: user,
      points: score,
      comments: comments,
      rank: parsedHeadlines[i].rank
    });
  });

  return stories;
}

const filterInvalidStories = (stories) => {
  return stories.filter((x) => {
    // Filter out empty titles and authors
    if (x.title.length === 0 || x.title.author === 0) {
      return false
    }

    // Filter out long titles and authors
    if (x.title.length > 256 || x.title.author > 256) {
      return false
    }

    return validUrl.isUri(x.uri);
  });
}

const formatComments = (text) => {
  const comments = parseInt(getFirstSection(text, 'comments').trim());

  if (Number.isInteger(comments)) {
    return comments;
  }
  return 0;
}

const formatRank = (text) => {
  const rank = parseInt(getFirstSection(text, '.'));
  if (Number.isInteger(rank)) {
    return rank;
  }
  return 0;
}

const formatScore = (text) => {
  if (!text) {
    return 0;
  }
  return parseInt(getFirstSection(text, ' '));
}

const getFirstSection = (text, seperator) => {
  return text.split(seperator)[0];
}

module.exports = {
  fetch: async (number) => {
    console.log('Fetching stories');
    const responses = await Promise.all(fetchData(number));

    console.log('Pages fetched - parsing response');
    const pages = responses.map((response) => {
      return parseResponse(response.data);
    });

    // Merge pages together
    let stories = []
    pages.forEach((page) => {
      page.forEach((story) => {
        stories.push(story);
      });
    });

    // We filter out invalid stories
    const filtered = filterInvalidStories(stories);

    if (filtered.length < number) {
      console.log(
        'After filtering stories only ' + filtered.length + ' remaining'
      );
      return filtered;
    }

    // Return only the number of stories user asked for
    return filtered.slice(0, number);
  }
}
