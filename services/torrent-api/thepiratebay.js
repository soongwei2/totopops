const axios = require('axios');
const config = require('config');
const pretty = require('prettysize');

module.exports = {
  get(type = 0, search = '') {
    switch (type) {
      case '0': //search
        console.log("here")
        return searchAPI(search);
      case '1': //top movies

        break;
      case '2': //top tv shows

        break;

      case '3': //toop music

        break;
    }
  }
}


//https://apibay.org/q.php?q=incredible%20hulk&cat=
function searchAPI(search = '') {
  console.log("search2: ", search)
  return axios.get(config.domains.thepiratebay, {
      params: {
        q: search,
        cat: '',
      }
    })
    .then(function (response) {
      console.log("response: ", response.data);
      return response.data.filter(x => x.id != 0).map((eachData) => {
        return {
          title: eachData.name,
          magnet: '',
          age: new Date(eachData.added * 1000).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          seed: eachData.seeders,
          size: pretty(eachData.size, true),
          path: '',
          path2: '',
        }
      });
    })

  function getPath(category = 0) {
    if (category == 201 ||
      category == 202 ||
      category == 204 ||
      category == 207) {
      return 'Movies';
    } else if (category == 205 ||
      category == 208) {
      return 'TV Shows';
    } else if (category == 101 ||
      category == 203) {
      return 'Music';
    }else{
      return 'Others';
    }
  }

}