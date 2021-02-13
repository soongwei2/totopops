const express = require('express');
const router = express.Router();
const thepiratebay = require('./thepiratebay');
const leetx = require('./leetx');
const config = require('config');
const {
    parameterHandler
} = require('../../utilities/handler/errorDef');


router.get('/searchGET', function (req, res, next) {

    const type = req.query.type;
    const search = req.query.search;

    parameterHandler([type]);

    return thepiratebay.get(type, search).then((results) => {
        if(!results || !results.length || !config.domains.thepiratebay.enabled){
            return leetx.get(type, search).then((results) => {
                return res.status(200).send(
                    {results});
            })
        }else{
            return res.status(200).send({results});
        }

      
    }).catch((reason) => {
        next(reason);
    });

});

router.get('/magnetGET', function (req, res, next) {

        const url = req.query.search;
    
        parameterHandler([url]);
    
        return leetx.magnet(url).then((results) => {
            return res.status(200).send(results);
        }).catch((reason) => {
            next(reason);
        });
    
    });

module.exports = router;