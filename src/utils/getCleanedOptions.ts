import tauist from 'tauist';

export const DEFAULT_NAMESPACE = 'Treasury';

const getDefaultOptions = (): TreasuryConfig => ({
	client: null,
	namespace: DEFAULT_NAMESPACE,
	ttl: tauist.s.fiveMinutes
});

export default (opts?: TreasuryOptions): TreasuryConfig =>
	Object.assign({}, getDefaultOptions(), opts);
