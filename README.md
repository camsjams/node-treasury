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

## Usage


### Sail.js
Here is a sample sails.js controller, without node-treasury, notice all the duplicated logic for handling cache that will be spread about your codebase.
``` js
client.get(key)
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
    .done(function(hasCache) {
        if (!hasCache) {
            Model.find()
                .then(function(data) {
                    res.ok(data);
                    return client.setex(key, JSON.stringify(data));
                })
                .catch(function(error) {
                    res.serverError(error);
                })
                .done(function() {
                    client.quit();
                });
        }
    });
```

## Notes
I tried really hard not to use a cache/cash pun when writing node-treasury.

This project was inspired by the excellent Node.js callback wrapper [souvenir](https://github.com/MakerStudios/souvenir).