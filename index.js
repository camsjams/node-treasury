'use strict';

function nativePromise(resolver) {
    return new Promise(resolver);
}

function treasury(promiseFactory) {
    promiseFactory = promiseFactory || nativePromise;
}

module.exports = treasury;
