import tauist from 'tauist';

export const DEFAULT_NAMESPACE = 'Treasury';

const getDefaultOptions = (): TreasuryOptions => ({
	client: null,
	namespace: DEFAULT_NAMESPACE,
	ttl: tauist.s.fiveMinutes
});

type Options = {
	client?: () => object;
	namespace?: string;
	ttl?: number;
}

export default (opts?: Options): TreasuryOptions =>
	Object.assign({}, getDefaultOptions(), opts);
