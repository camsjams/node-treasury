'use strict';

class BaseAdapter {
    constructor(client, promiseFactory) {
        this.client = client;
        this.promiseFactory = promiseFactory;
    }
}

module.exports = BaseAdapter;