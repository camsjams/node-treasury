'use strict';
var tauist = require('tauist');

function defaultClient() {
    return null;
}

function getDefaultOptions() {
    return {
        client: defaultClient,
        promiseFactory: nativePromise,
        ttl: tauist.s.fiveMinutes
    };
}

function getCleanedOptions(opts) {
    return Object.assign({}, getDefaultOptions(), opts);
}

function nativePromise(resolver) {
    return new Promise(resolver);
}

function Treasury(opts) {
    var config = getCleanedOptions(opts);

    return {
        invest: invest,
        divest: divest
    };

    function invest(thePromise, options) {
        // get from cache
            // if found in cache
                // return value via promise
            // if not found in cache
                // run promise for value
                    // if promise successful
                        // set to cache
                            // return data via promise
        // end consumer handles all catches!

        return config.promiseFactory(function(resolve, reject) {
            thePromise
                .then(function() {
                    resolve();
                })
                .catch(function() {
                    reject();
                });
        });
    }

    function divest() {
        return config.promiseFactory(function(resolve, reject) {
            resolve();
        });
    }
}

module.exports = Treasury;
