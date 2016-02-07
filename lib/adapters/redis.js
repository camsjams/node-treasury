'use strict';

var BaseAdapter = require('./base');

class RedisClientAdapter extends BaseAdapter {
    get(key) {
        var redisClient = this.client;
        var self = this;
        return new this.promiseFactory(function(resolve, reject) {
            redisClient.get(key, function(error, results) {
                if (error || results === null) {
                    return reject(null);
                }

                resolve(self.getUnserializedData(results));
            });
        });
    }

    set(key, value, ttl) {
        var redisClient = this.client;
        value = JSON.stringify(value);
        return new this.promiseFactory(function(resolve, reject) {
            redisClient.setex(key, ttl, value, function(error) {
                if (error) {
                    return reject(error);
                }
                resolve(true);
            });
        });
    }

    del(key) {
        var redisClient = this.client;
        return new this.promiseFactory(function(resolve, reject) {
            redisClient.del(key, function(error, results) {
                if (error || results === null) {
                    return reject(null);
                }

                resolve(true);
            });
        });
    }
}

module.exports = RedisClientAdapter;
