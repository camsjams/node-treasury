# Node Treasury: A promise to check for data in your cache layer first
Check your caching layer before running your promises.

master:
![master](https://circleci.com/gh/camsjams/node-treasury/tree/master.svg?style=shield&circle-token=a1a0cc4cef2164e9c0a8b5dd18f98797dadcf292)
develop:
![develop](https://circleci.com/gh/camsjams/node-treasury/tree/develop.svg?style=shield&circle-token=a1a0cc4cef2164e9c0a8b5dd18f98797dadcf292)

## Platforms / Technologies
* [Node.js](http://nodejs.org/)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Redis](http://redis.io/)
* [Node Redis](https://github.com/NodeRedis/node_redis)
* [Memcached](http://memcached.org/)
* [Memcached node client](https://github.com/3rd-Eden/memcached)
* [Tauist](https://github.com/camsjams/node-tauist)

## Currently supported cache adapters
* in memory storage
* redis storage via [Node Redis](https://github.com/NodeRedis/node_redis)
* memcached storage via [Memcached node client](https://github.com/3rd-Eden/memcached)

## Install
>       $ npm install treasury --save

## Usage

### Constructor Options
``` js
var Treasury = require('treasury');

// default options for main class wrapper
var treasury = new Treasury({
    client: null,
    namespace: 'Treasury',
    promiseFactory: Promise, // defaults to native promise
    ttl: tauist.s.fiveMinutes
});
```

#### option: client
If null, Treasury will default to in-memory cache with managed expiration.

You can also pass a redis or memcached client in:
``` js
var Memcached = require('memcached');
var client = new Memcached();
// please see adapters section for all currently supported adapters
var redis = require('redis');
var client = redis.createClient();

var treasury = new Treasury({client: client});
```

#### option: namespace
This is used to set a default namespace in the event that the `invest` function is invoked without a namespace option.

#### option: promiseFactory
This is used to set the type of `Promise` used, and defaults to the native `Promise` class. Treasury is also tested with [Q](https://github.com/kriskowal/q) and [Bluebird](https://github.com/petkaantonov/bluebird) promises.
``` js
// using Bluebird
var treasury = new Treasury({promiseFactory: require('bluebird')});
// using Q js
var treasury = new Treasury({promiseFactory: require('q').Promise});
```

#### option: ttl
The default time-to-live for any cached objects, which will be used in the event that the `invest` function is invoked without a ttl option. It is recommended to utilize the [Tauist](https://github.com/camsjams/node-tauist) package to ease your reuse of expiration amounts.

### Treasury.invest(thePromise, options)
The `invest` function is used to wrap cache logic around a Promise, where the cache provider is checked for the data first before running the code for the promised value. If the cache cannot retrieve the data, the Promise is invoked and then the successfully promised value is stored in cache for later use.

The first parameter is the promise that you wish to wrap with this logic.
``` js
treasury.invest(doTheThingToReallyGetData);
```

Additionally, you may utilize the options parameter to customize the cache usage for this `invest` call.
``` js
treasury.invest(doTheThingToReallyGetData, {
    namespace: 'aCustomCachePrefix',
    ttl: 'in minutes'
});
```
#### option: namespace
This is used to set the namespace for this wrapped Promise. It will fall back to the default Treasury namespace option if not set.

#### option: ttl
This is used to set the time-to-live for this wrapped Promise. It will fall back to the default Treasury default ttl option if not set.

### using invest() with bind
When using the `Function.prototype.bind()` method to curry a new function with some arguments, please advise that you need to pass these into the options parameter in order for Treasury to properly differentiate that invocation compared to others.

In this example, `id` is the main parameter to `doTheThingToReallyGetData`, so it is bound for the Promise to be called. Additionally it is passed as a property to the options object to identify it for a unique cache later on.
``` js
treasury.invest(doTheThingToReallyGetData.bind(null, id), {id: id});
```

### Treasury.divest(options)
The `divest` function is used to manually delete or invalidate a cached item. It expects the same `options` object used by the `invest` function in order to find the proper row of data to remove.
``` js
treasury.divest({
    namespace: 'aCustomCachePrefix',
    ttl: 'in minutes'
});
```
#### option: namespace
This is used to find the namespace for this wrapped Promise. It will fall back to the default Treasury namespace option if not set.

### Basic usage - see full code in the [examples](examples)
Here is a basic sample of "before" code using a redis cache layer.

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
Here is a sample [Sails.js](https://github.com/balderdashy/sails) controller that caches model data into memory. Without Treasury, notice all the duplicated logic for handling cache that will be spread about your codebase.
``` js
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
```

With the addition of the lightweight Treasury, you can save the boilerplate!
``` js
testit: function(req, res) {
    var params = req.allParams();
    var id = params.id;

    treasury.invest(User.find.bind(User, id), {id: id})
        .then(function(modelData) {
            console.log('treasury.invest found data:', modelData);
            res.ok(modelData);
        })
        .catch(function(error) {
            console.log('treasury.invest could not find data, err', error);
            res.serverError(error);
        });
}
```

## Pull Requests
In order to properly run the tests for this repo, on top of the npm install, you will need the dependencies in [Circle CI config](circle.yml). All PRs require passing JSHint, JavaScript Code Style Checker (JSCS), and updated/added/passing unit and integration tests.

## Notes
I tried really hard not to use a cache/cash pun when writing node-treasury.

This project was inspired by the excellent Node.js callback wrapper [souvenir](https://github.com/MakerStudios/souvenir).
