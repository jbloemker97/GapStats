// https://financialmodelingprep.com/
const axios = require('axios');

function fmp (apiKey) {
    return Object.freeze({
        gapStats
    });

    async function gapStats ({ ticker }) {
        const data = await historicalQuotes({ ticker });
        let bars = [];
        let totalPercent = 0;
        let closesBelowOpen = 0;

        for (let i = 0; i < data.length; i++) {
            // If we have an index to compare to
            if (data[i+1]) {
                // gaps above 20%
                if (getGapPercent(data[i+1]['close'], data[i]['open']) > 20) {
                    bars.push(data[i]);

                    // Add % to get average
                    totalPercent += getGapPercent(data[i+1]['close'], data[i]['open']);

                    // Closes below open?
                    if (data[i]['close'] < data[i]['open']) {
                        // Add total close below open
                        closesBelowOpen++;
                    }
                }
            }
        }

        return {
            gapsAbove20Percent: bars.length,
            averageGapPercent: round(totalPercent / bars.length),
            previousGapsHigh: bars[0]['high'],
            closesBelowOpen: closesBelowOpen,
            closeBelowOpenPercent: round(closesBelowOpen / bars.length),
            previousGapDayVolume: bars[0]['volume'],
        };
    
    }

    async function historicalQuotes ({ ticker }) {
        // 253 trading days in a year

        let url = buildRequest(`/historical-price-full/${ticker.toUpperCase()}`);

        try {
            let response = await axios.get(url);
            let bars = response.data.historical.slice(0, 1265); // 5 Years ish

            return bars;
        }catch (error) {
            throw Error(`Could not get stock quote history. Error: ${error.message}`);
        }
    }

    function getGapPercent (previousClose, open) {
        if (previousClose && open) {
            const diff = open - previousClose;
            const diffPercent = (diff / previousClose) * 100;

            return round(diffPercent);
        }
        return false;
    }

    function buildRequest (url, params = {}) {
        let baseUrl = `https://financialmodelingprep.com/api/v3${url}?apikey=${apiKey}`;

        if (params) {
            for (let key in params) {
                baseUrl += `&${key}=${params[key]}`;
            }
        }

        return baseUrl;
    }

    function round (num) {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }
}

module.exports = fmp;