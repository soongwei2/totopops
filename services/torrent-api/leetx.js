/**!
 * xTorrent
 * @author c0b41 <cobaimelan@protonmail.ch>
 * @license MIT
 */
const config = require('config');
const errorCodes = require('../../utilities/handler/error.codes');
const cheerio = require('cheerio'),
  got = require('got');


  module.exports = {
    get(type = 0, search = '') {
      switch (Number.parseInt(type)) {
        case 0: //search
          return searchAPI(search);
        case 1: //top movies
          return top100API(config.domains.leetx.top100movies);
        case 2: //top tv shows
          return top100API(config.domains.leetx.top100tvshows);
        case 3: //toop music
          return top100API(config.domains.leetx.top100music);
        default:
          throw errorCodes.INVALID_PARAMETER;
      }
    },
    magnet(url = ''){
      return info(url);
    },
  }



/**
 * @method search
 * @desc xTorrent search method
 * @param {object} opt - example {query:"Fight Club"}
 * @returns {function} promise
 */
const searchAPI = (search = '') => {

  let reqUrl = config.domains.leetx.search + encodeURIComponent(search) + '/1/';

  return got(reqUrl,{timeout: config.domains.leetx.timeout}).then(data => {
    let $ = cheerio.load(data.body);

    let table = $('tbody > tr');

    let torrents = [];

    table.each((i, elem) => {
      let chunk = cheerio.load(elem);

      torrents.push({
        title: chunk('.coll-1').text(),
        magnet: config.domains.leetx.url + chunk('a')
        .eq(1)
        .attr('href'),
        age: chunk('.coll-date').text(),
        seed: chunk('.coll-2').text(),
        size: chunk('.coll-4')
          .children()
          .remove()
          .end()
          .text(),
        path: null,
        path2: null,
      });
    });

    return torrents;
  }).catch((error) => {
    console.error("searchAPI: " , error);
      return [];
  });
};

/**
 * @method info
 * @desc xTorrent info method
 * @param {string} url - example http://1337x.org/torrent/738327/New-Girl-S03E14-HDTV-x264-LOL/
 * @returns {function} promise
 */

const info = url => {
  return got(url,{timeout: config.domains.leetx.timeout}).then(data => {
    let $detail = cheerio.load(data.body);
    let $content = cheerio.load($detail.html());

    let info = {};

    let $info_left = cheerio.load(
      $content('ul.list')
        .eq(1)
        .html(),
    );
    let $info_right = cheerio.load(
      $content('ul.list')
        .eq(2)
        .html(),
    );

    info.category = $info_left('li')
      .eq(0)
      .children('span')
      .text()
      .trim();

    info.results = $content('ul > li > a[href^=magnet]')
    .eq(0)
    .attr('href');

    if(info && info.category == 'Movies'){
      info.category = 'Movies';
    }else if(info && info.category == 'TV'){
      info.category = 'TV Shows';
    }else if(info && info.category == 'Music'){
      info.category = 'Music';
    }else{
      info.category = 'Others';
    }

    return info;
  });
};

function top100API(url) {

  return got(url,{timeout: config.domains.leetx.timeout}).then(data => {
    let $ = cheerio.load(data.body);

    let table = $('tbody > tr');

    let torrents = [];

    table.each((i, elem) => {
      let chunk = cheerio.load(elem);

      torrents.push({
        title: chunk('.coll-1').text(),
        magnet: config.domains.leetx.url + chunk('a')
        .eq(1)
        .attr('href'),
        age: chunk('.coll-date').text(),
        seed: chunk('.coll-2').text(),
        size: chunk('.coll-4')
          .children()
          .remove()
          .end()
          .text(),
        path: null,
        path2: null,
      });
    });

    return torrents;
  }).catch((error) => {
    console.error("searchAPI: " , error);
      return [];
  });
}
