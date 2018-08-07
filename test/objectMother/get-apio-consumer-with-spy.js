import ApioConsumer from '../../src/consumer/apio-consumer';
import httpClientSpy from '../doubles/client-spy';

const getApioConsumerWithSpy = config => {
	const clientSpy = new httpClientSpy();
	const apioConsumer = new ApioConsumer(config);
	apioConsumer.client = clientSpy;
	return {apioConsumer, clientSpy};
};

export {getApioConsumerWithSpy};
