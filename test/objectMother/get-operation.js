import Operation from '../../src/model/operation';

const getOperation = (
	target = 'http://validurl.com',
	method = 'POST',
	expects = null
) => new Operation('id', target, method, expects, [], null);

const getOperationWithForm = () =>
	getOperation('http://validurl.com', 'POST', 'http://validformurl.com');

const getOperationWithMethod = method =>
	getOperation('http://validurl.com', method, 'http://validformurl.com');

export {getOperation, getOperationWithForm, getOperationWithMethod};
