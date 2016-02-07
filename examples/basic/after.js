var redis = require('redis');
var Treasury = require('../../index');
var cacheClient = redis.createClient();
var treasury = new Treasury({client: cacheClient});

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
    return treasury.invest(doTheThingToReallyGetData.bind(null, id), {id: id});
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
