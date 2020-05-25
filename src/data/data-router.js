const express = require('express');
const router = express.Router();
const Controller = require('./data-controller')();

router.get('/gap-stats/:ticker', async function (req, res) {
    let response = await Controller.getGapStats({ ticker: req.params.ticker });

    // Set Headers
    if (response.headers) {
        res.set(response.headers);
    }

    // Send Reponse
    res.status(response.statusCode).send(response);
});

module.exports = router;