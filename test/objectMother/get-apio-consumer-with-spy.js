import ApioConsumer from '../../src/consumer/apio-consumer';
import httpClientSpy from '../doubles/client-spy';

const getApioConsumerWithSpy = () => {
	const clientSpy = new httpClientSpy();
	const apioConsumer = new ApioConsumer();
	apioConsumer.client = clientSpy;
	return {apioConsumer, clientSpy};
};

export {getApioConsumerWithSpy};
