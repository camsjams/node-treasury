import tauist from 'tauist';

export const DEFAULT_NAMESPACE = 'Treasury';

export type TreasuryOptions = {
	client?: object;
	namespace?: string;
	ttl?: number;
}

export type TreasuryConfig = {
	client: object;
	namespace: string;
	ttl: number;
}

const getDefaultOptions = (): TreasuryConfig => ({
	client: null,
	namespace: DEFAULT_NAMESPACE,
	ttl: tauist.s.fiveMinutes
});

export default (opts?: TreasuryOptions): TreasuryConfig =>
	Object.assign({}, getDefaultOptions(), opts);
