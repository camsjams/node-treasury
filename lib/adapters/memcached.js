'use strict';

var BaseAdapter = require('./base');

class MemcachedClientAdapter extends BaseAdapter {
    getData(key) {
      var memcachedClient = this.client;
      var self = this;
      return new this.promiseFactory(function(resolve, reject) {
          memcachedClient.get(key, function(error, results) {
            if(error || results === undefined) {
                return reject(null);
            }

            resolve(self.getUnserializedData(results));
          });
      });
    }

    setData(key, value, ttl) {
      var memcachedClient = this.client;
      value = JSON.stringify(value);
      return new this.promiseFactory(function(resolve, reject) {
          memcachedClient.set(key, value, ttl, function(error, results) {
            if(error) {
                return reject(error);
            }
            resolve(true);
          });
      });
    }

    deleteData(key) {

    }
}

module.exports = MemcachedClientAdapter;
