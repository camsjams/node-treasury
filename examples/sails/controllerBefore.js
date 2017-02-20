var redis = require('redis');
var bluebird = require('bluebird');
var User = global.User || {};

bluebird.promisifyAll(redis.RedisClient.prototype);
var cacheClient = redis.createClient();

module.exports = {
	testit: function(req, res) {
		var params = req.allParams();
		var id = params.id;
		var key = 'MyModel:' + id;

		cacheClient.getAsync(key)
			.then((data) => {
				console.log(key + ' isInCache =', !!data);
				if (data) {
					return res.ok(JSON.parse(data));
				}

				return Promise.reject('NO_CACHE');
			})
			.catch((err) => {
				if (err !== 'NO_CACHE') {
					return Promise.reject(err);
				}

				User.find(id)
					.then((modelData) => {
						// return data; also cache
						console.log(key + ' not in cache, retrieved:', modelData);
						return cacheClient.setexAsync(key, 10, JSON.stringify(modelData))
							.then(() => {
								res.ok(modelData);
							});
					})
					.catch((error) => {
						res.serverError(error);
					});

			});
	}
};
