const express = require('express');
const router = express.Router();
const thepiratebay = require('./thepiratebay');
const leetx = require('./leetx');
const config = require('config');
const {
    parameterHandler
} = require('../../utilities/handler/errorDef');


router.get('/searchGET', async function (req, res, next) {

    const type = req.query.type;
    const search = req.query.search;

    parameterHandler([type]);

    let results = [];
    if(!results.length && config.domains.thepiratebay.enabled){
        
        results = await thepiratebay.get(type, search);
    }

    if(!results.length && config.domains.leetx.enabled){
       
        results = await leetx.get(type, search);
    }
    
    return res.status(200).send({results});

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