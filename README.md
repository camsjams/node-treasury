# Node Treasury: A promise to check for data in your cache layer first
Check your caching layer before running your promises.

## Current Version 1.0.0

master:
![master](https://circleci.com/gh/camsjams/node-treasury/tree/master.svg?style=shield&circle-token=a1a0cc4cef2164e9c0a8b5dd18f98797dadcf292)
develop:
![develop](https://circleci.com/gh/camsjams/node-treasury/tree/develop.svg?style=shield&circle-token=a1a0cc4cef2164e9c0a8b5dd18f98797dadcf292)

## Platforms / Technologies
* [nodejs](http://nodejs.org/)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Redis](http://redis.io/)
* [Node Redis](https://github.com/NodeRedis/node_redis)
* [Memcached](http://memcached.org/)
* [Memcached node client](https://github.com/3rd-Eden/memcached)

## Currently supported cache adapters
* in memory storage
* redis storage via [Node Redis](https://github.com/NodeRedis/node_redis)
* memcached storage via [Memcached node client](https://github.com/3rd-Eden/memcached)

## Usage

### Options
``` js
var key = 'MyModel:' + id;
```

### Basic usage - see full code in the [examples](examples)
Here is a basic sample of "before" code using redis cache.

``` js
var key = 'MyModel:' + id;  // you have to manage the keys!
var cacheClient = redis.createClient();

cacheClient.getAsync(key) // you have to promisify the cache client!
      .then(function(data) {
          if (data) {
              // you have to manage the object --> JSON string!
              return Promise.resolve(JSON.parse(data));
          } else {
              return Promise.reject('NO_CACHE');
          }
      })
      .catch(function(err) {
          if (err !== 'NO_CACHE') {
              // you have to manage error filtering!
              return Promise.reject(err);
          } else {
              return doTheThingToReallyGetData({id: id})
                  .then(function(modelData) {
                      // return data
                      // also cache
                      // you have to manage the JSON string --> object!
                      return cacheClient.setexAsync(key, 10, JSON.stringify(modelData))
                          .then(function() {
                              return modelData;
                          });
                  });
          }
      })
      .then(function(data) {
          console.log('found data:', data);
      })
      .catch(function(err) {
          console.log('could not find data, err:', err);
      });


```

Wouldn't it be great to just do this?
``` js

treasury.invest(doTheThingToReallyGetData({id: id}))
    .then(function(data) {
        console.log('found data:', data);
    })
    .catch(function(err) {
        console.log('could not find data, err:', err);
    });
```

### Sails.js
Here is a sample [Sails.js](https://github.com/balderdashy/sails) controller that caches model data into memory. Without node-treasury, notice all the duplicated logic for handling cache that will be spread about your codebase.
``` js
var key = 'MyModel:' + someModelId;
var cacheClient = redisOrMemcached.creatClient(); // assume it is promisified

cacheClient.get(key)
    .then(function(data) {
        if (data && data.length) {
            data = JSON.parse(data);
            if (data.length && data[0] && data[0].id) {
                res.ok(data);
                return true;
            }
        }
        return false;
    })
    .then(function(hasCache) {
        // not ideal, but you need to figure out if the item was in cache!
        if (!hasCache) {
            MyModel.find()
                .then(function(data) {
                    res.ok(data);
                    return cacheClient.setex(key, JSON.stringify(data));
                })
                .catch(function(error) {
                    res.serverError(error);
                })
                .done(function() {
                    cacheClient.quit();
                });
        }
    });
```

With the addition of the lightweight node-treasury, you can save the boilerplate!
``` js
var Memcached = require('memcached');
var client = new Memcached();
// see adapters section for all currently supported adapters
var redis = require('redis');
var client = redis.createClient();

// It is recommended to use a single version of node-treasury.
var TreasuryService = new Treasury({client: client});

// same controller as before, now less logic
TreasuryService.invest(MyModel.find())
    .then(function(data) {
        res.ok(data);
    })
    .catch(function(error) {
        res.serverError(error);
    });
```

## Pull Requests
In order to properly run the tests for this repo, on top of the npm install, you will need the dependencies in [Circle CI config](circle.yml). All PRs require passing JSHint, JavaScript Code Style Checker (JSCS), and updated/added/passing unit and integration tests.

## Notes
I tried really hard not to use a cache/cash pun when writing node-treasury.

This project was inspired by the excellent Node.js callback wrapper [souvenir](https://github.com/MakerStudios/souvenir).
