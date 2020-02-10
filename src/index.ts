
import crypto from 'crypto';
import tauist from 'tauist';
import stringify from 'json-stable-stringify';
import getAdapter from './adapter';

const DEFAULT_NAMESPACE = 'Treasury';

function getDefaultOptions(): Options {
	return {
		client: null,
		namespace: DEFAULT_NAMESPACE,
		ttl: tauist.s.fiveMinutes
	};
}

function getCleanedOptions(opts: Options): Options {
	return Object.assign({}, getDefaultOptions(), opts);
}

function getKey(fnParams: object, namespace: string): string {
	const ns = (namespace || DEFAULT_NAMESPACE) + ':';
	const fingerprint = stringify(fnParams || {});
	return ns + crypto.createHash('md5').update(fingerprint).digest('hex');
}

export type Options = {
	client: null;
	namespace: string;
	ttl: number;
}

export type InvestOptions = {
	namespace?: string;
	ttl?: number;
}

export type DivestOptions = {
	namespace?: string;
}

class Treasury {
	config: Options;

	treasury: TreasuryAdapter;

	constructor(options: Options) {
		this.config = getCleanedOptions(options);
		this.treasury = getAdapter(this.config.client);
	}

	async invest<T>(thePromise: (p: Options) => Promise<T>, overrides: InvestOptions): Promise<T> {
		const options = overrides || {
			namespace: overrides.namespace || this.config.namespace,
			ttl: overrides.ttl || this.config.ttl
		};

		// get from cache
		// -- if found in cache
		// ---- return value via promise
		// -- if not found in cache
		// ---- run promise for value
		// ------ if promise successful
		// -------- set to cache
		// ---------- return data via promise
		// end consumer handles all catches except cache failure!

		const key = getKey(this.config, options.namespace);
		const ttl = ~~options.ttl;

		return this.treasury.get<T>(key)
			.catch(() => thePromise(this.config)
				.then((promisedValue) => this.treasury.set(key, promisedValue, ttl)
					.then(() => promisedValue)));
	}

	divest<T>(options: DivestOptions): Promise<true> {
		const ns = options.namespace || this.config.namespace;
		const key = getKey(options, ns);

		return this.treasury.del(key);
	}
}

export default Treasury;
