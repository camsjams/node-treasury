'use strict';

const DEFAULT_NAMESPACE = 'Treasury';

var tauist = require('tauist');
var crypto = require('crypto');
var stringify = require('json-stable-stringify');

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
	fnParams = stringify(fnParams || {});
	return namespace + crypto.createHash('md5').update(fnParams).digest('hex');
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
		// end consumer handles all catches except cache failure!

		var ns = options.namespace || config.namespace;
		var key = getKey(options, ns);
		var ttl = ~~(options.ttl || config.ttl);

		return client.get(key)
			.catch(() => {
				return thePromise(options)
					.then((promisedValue) => {
						return client.set(key, promisedValue, ttl)
							.then(() => {
								return promisedValue;
							});
					});
			});
	}

	function divest(options) {
		var ns = options.namespace || config.namespace;
		var key = getKey(options, ns);
		return client.del(key);
	}
}

module.exports = Treasury;
