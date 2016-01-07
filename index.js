'use strict';

const DEFAULT_NAMESPACE = 'Treasury';

var tauist = require('tauist');
var crypto = require('crypto');

var adapters = require('./lib/adapters');

function getDefaultOptions() {
    return {
        client: null,
        namespace: DEFAULT_NAMESPACE,
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

function getKey(fnParams, namespace) {
    namespace = (namespace || DEFAULT_NAMESPACE) + ':';
    fnParams = JSON.stringify(fnParams || {});
    return namespace + crypto.createHash("md5").update(fnParams).digest("hex");
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

        var ns = options.namespace || config.namespace;
        var ttl = ~~(options.ttl || config.ttl);
        var key = getKey(options, ns);

        console.log('using key:', key);

        // todo refactor
        return client.get(key)
            .catch(function notFoundInCache(error) {
                return thePromise
                  .then(function(value) {
                    return client.set(key, value, ttl)
                    .then(function(){return value;});
                  });
            });


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
