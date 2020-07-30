const express = require('express');
const router = express.Router();
const thepiratebay = require('./thepiratebay');
const {
    parameterHandler
} = require('../../utilities/handler/errorDef');


router.get('/searchGET', function (req, res, next) {

    const type = req.query.type;
    const search = req.query.search;

    parameterHandler([type]);

    return thepiratebay.get(type, search).then((results) => {
        return res.status(200).send(results);
    }).catch((reason) => {
        next(reason);
    });

});

module.exports = router;