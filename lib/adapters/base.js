'use strict';

class BaseAdapter {
	constructor(client, promiseFactory) {
		this.client = client;
		this.PromiseFactory = promiseFactory;
	}

	getUnserializedData(value) {
		try {
			value = JSON.parse(value);
		} catch (e) {
			value = null;
		}
		return value;
	}
}

module.exports = BaseAdapter;
