'use strict';

var tauist = require('tauist');
var adapters = require('./lib/adapters');

function getDefaultOptions() {
    return {
        client: null,
        namespace: 'Treasury',
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

function getKey(originalParameters, namespace) {
    return namespace + JSON.stringify(originalParameters);
}

function Treasury(opts) {
    var config = getCleanedOptions(opts);
    var client = adapters.getClientAdapter(config.client, config.promiseFactory);

    return {
        invest: invest,
        divest: divest
    };

    function invest(thePromise, options) {
      options = options || {};
        // get from cache
        // -- if found in cache
        // ---- return value via promise
        // -- if not found in cache
        // ---- run promise for value
        // ------ if promise successful
        // -------- set to cache
        // ---------- return data via promise
        // end consumer handles all catches!

        var key = getKey(arguments);
        var ttl = ~~(options.ttl || config.ttl);

        return client.get(key)
            .catch(function notFoundInCache(error) {
                console.log('not found in cache');
                return thePromise
                  .then(function(value) {
                    console.log('the intended promise is completed', arguments);
                    return client.set(key, value, ttl);
                  })
            })
            .then(function finalValue() {
                  console.log('finalValue the promise is completed', arguments);
            })


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
