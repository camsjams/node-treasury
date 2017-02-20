var redis = require('redis');
var bluebird = require('bluebird');
var User = User || {};

bluebird.promisifyAll(redis.RedisClient.prototype);
var cacheClient = redis.createClient();

module.exports = {
	testit: function(req, res) {
		var params = req.allParams();
		var id = params.id;
		var key = 'MyModel:' + id;

		cacheClient.getAsync(key)
			.then(function(data) {
				console.log(key + ' isInCache =', !!data);
				if (data) {
					return res.ok(JSON.parse(data));
				}

				return Promise.reject('NO_CACHE');
			})
			.catch(function(err) {
				if (err !== 'NO_CACHE') {
					return Promise.reject(err);
				}

				User.find(id)
					.then(function(modelData) {
						// return data; also cache
						console.log(key + ' not in cache, retrieved:', modelData);
						return cacheClient.setexAsync(key, 10, JSON.stringify(modelData))
							.then(function() {
								res.ok(modelData);
							});
					})
					.catch(function(error) {
						res.serverError(error);
					});

			});
	}
};
