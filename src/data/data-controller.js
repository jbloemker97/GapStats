const { fmpApiKey } = require('../config');
const fmp = require('./fmp/fmp-service')(fmpApiKey);
const httpResponse = require('../helpers/httpResponse');

function Controller () {
    return Object.freeze({
        getGapStats
    }); 

    async function getGapStats ({ ticker }) {
        try {
            const data = await fmp.gapStats({ ticker });

            return httpResponse({ 
                success: true,
                statusCode: 200,
                data,
                clientMessage: 'Success!'
            });
        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error.message,
                clientMessage: 'Error. Could not get gap stats'
            });
        }
    }
}

module.exports = Controller;