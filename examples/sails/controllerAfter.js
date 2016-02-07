var redis = require('redis');
var Treasury = require('node-treasury');
var cacheClient = redis.createClient();
var treasury = new Treasury({client: cacheClient});

module.exports = {
    testit: function(req, res) {
        var params = req.allParams();
        var id = params.id;

        treasury.invest(User.find.bind(User, id), {id: id})
            .then(function(modelData) {
                console.log('treasury.invest found data:', data);
                res.ok(modelData);
            })
            .catch(function(error) {
                console.log('treasury.invest could not find data, err', data);
                res.serverError(error);
            });
    }
};