
import crypto from 'crypto';
import stringify from 'json-stable-stringify';
import {DEFAULT_NAMESPACE} from './getCleanedOptions';

export default (fnParams: object = {}, namespace = DEFAULT_NAMESPACE): string => {
	const ns = (namespace || DEFAULT_NAMESPACE) + ':';
	const fingerprint = stringify(fnParams || {});
	return ns + crypto.createHash('md5').update(fingerprint).digest('hex');
};
