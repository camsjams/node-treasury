'use strict';

var tauist = require('tauist');

function getDefaultOptions() {
    return {
        ttl: tauist.s.fiveMinutes,
        promiseFactory: nativePromise
    };
}

function nativePromise(resolver) {
    return new Promise(resolver);
}

function Treasury(opts) {
    opts = opts || getDefaultOptions();
    var promiseFactory = opts.promiseFactory || nativePromise;
    var defaultTtl = ~~(opts.ttl) || tauist.s.fiveMinutes;

    return {
        invest: invest,
        divest: divest
    };

    function invest(thePromise, options) {
        console.log('thePromise', thePromise);
        console.log('options', options);
        return promiseFactory(function(resolve, reject) {
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
        return promiseFactory(function(resolve, reject) {
            resolve();
        });
    }
}

module.exports = Treasury;
