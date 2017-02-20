var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
var cacheClient = redis.createClient();

function doTheThingToReallyGetData(id) {
	return new Promise(function(resolve, reject) {
		if (id === 1) {
			return resolve({
				id: id,
				user: 'Scrooge McDuck',
				netWorth: 13370000000
			});
		}

		reject('NOT_FOUND');
	});
}

function getModelData(id) {
	var key = 'MyModel:' + id;  // you have to manage the keys!

	return cacheClient.getAsync(key)
		.then(function(data) {
			console.log(key + ' isInCache =', !!data);
			if (data) {
				return Promise.resolve(JSON.parse(data));
			}

			return Promise.reject('NO_CACHE');
		})
		.catch(function(err) {
			if (err !== 'NO_CACHE') {
				return Promise.reject(err);
			}

			return doTheThingToReallyGetData(id)
				.then(function(modelData) {
					// return data; also cache
					console.log(key + ' not in cache, retrieved:', modelData);
					return cacheClient.setexAsync(key, 10, JSON.stringify(modelData))
						.then(function() {
							return modelData;
						});
				});

		});
}

// will find the data from promise on first time, then get from cache if called again
getModelData(1)
	.then(function(data) {
		console.log('getModelData(1) found data:', data);
	})
	.catch(function(err) {
		console.log('getModelData(1) could not find data, err:', err);
	})
	.then(function() {
		// will find no find data from promise
		getModelData(2)
			.then(function(data) {
				console.log('getModelData(2) found data:', data);
			})
			.catch(function(err) {
				console.log('getModelData(2) could not find data, err:', err);
			});
	});
