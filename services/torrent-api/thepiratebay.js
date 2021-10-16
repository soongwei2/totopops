const axios = require('axios');
const config = require('config');
const pretty = require('prettysize');
const errorCodes = require('../../utilities/handler/error.codes');
const { parameterHandler } = require('../../utilities/handler/errorDef');

module.exports = {
  get(type = 0, search = '') {
    switch (Number.parseInt(type)) {
      case 0: //search
        return searchAPI(search);
      case 1: //top movies
        return top100API(config.domains.thepiratebay.top100movies);
      case 2: //top tv shows
        return top100API(config.domains.thepiratebay.top100tvshows);
      case 3: //toop music
        return top100API(config.domains.thepiratebay.top100music);
      default:
        throw errorCodes.INVALID_PARAMETER;
    }
  }
}


function searchAPI(search = '') {
  return axios.get(config.domains.thepiratebay.search, {
      params: {
        q: search,
        cat: '',
      },
      timeout: config.domains.thepiratebay.timeout,
    })
    .then(function (response) {
      return response.data.filter(x => x.id != 0).map((eachData) => {
        return parseEachTorrent(eachData);
      });
    })
    .catch((reason) => {
      return [];
    });
}

function top100API(url) {
  return axios.get(url, {timeout: config.domains.thepiratebay.timeout})
    .then(function (response) {
      return response.data.filter(x => x.id != 0).map((eachData) => {
        return parseEachTorrent(eachData);
      });
    }).catch((reason) => {
      return [];
    });
}

function parseEachTorrent(eachData) {
  return {
    title: eachData.name,
    magnet: 'magnet:?xt=urn:btih:' + eachData.info_hash + '&dn=' + encodeURIComponent(eachData.name),
    age: new Date(eachData.added * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    seed: eachData.seeders,
    size: pretty(eachData.size, true),
    path: '',
    path2: getPath(eachData.category),
  }
}

function getPath(category = 0) {
  if (category == 201 ||
    category == 202 ||
    category == 204 ||
    category == 207) {
    return 'Movies';
  } else if (category == 205 ||
    category == 208) {
    return 'TV';
  } else if (category == 101 ||
    category == 203) {
    return 'Music';
  } else {
    return 'Others';
  }
}