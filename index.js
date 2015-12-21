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
