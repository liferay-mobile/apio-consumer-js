import ApioConsumer from '../src/consumer/apio-consumer';
import httpClientSpy from './doubles/client-spy';
import {ConversionHandler, collectionConverter} from '../src/converters';
import Thing from '../src/model/thing';
import FormData from 'form-data';
import formResponse from './fixtures/response-form';
import responseWithoutEmbbeded from './fixtures/response-without-embbeded';
import responseWithEmbbeded from './fixtures/response-with-embbeded';
import {getApioConsumerWithSpy} from './objectMother';

import {
	getOperation,
	getOperationWithForm,
	getOperationWithMethod,
} from './objectMother';
import Collection from '../src/model/collection';

describe('Apio consumer getOperation form', () => {
	it(`should throw a exception if the operation doesn't have a form`, async () => {
		const consumer = new ApioConsumer();

		const operationWithoutForm = getOperation();

		let errorMessage = 'No error';
		try {
			await consumer.getOperationForm(operationWithoutForm);
		} catch (error) {
			errorMessage = error.message;
		}

		expect(errorMessage).toBe(
			`Operation ${
				operationWithoutForm.id
			} doesn't have a form associated`
		);
	});

	it('should get form json and parse it to a form model', async () => {
		const getMock = jest.fn().mockReturnValue(formResponse);

		const consumer = new ApioConsumer();
		consumer.client.get = getMock;

		const operationWithForm = getOperationWithForm();

		const form = await consumer.getOperationForm(operationWithForm);

		expect(form.id).toBe('https://apiosample.wedeploy.io/f/u/people');
		expect(form.title).toBe('The person form');
		expect(form.description).toBe(
			'This form can be used to create or update a person'
		);

		expect(form.properties[0].name).toBe('jobTitle');
		expect(form.properties[0].required).toBe(false);
		expect(form.properties[1].name).toBe('birthDate');
		expect(form.properties[1].required).toBe(true);
	});
});

describe('Apio consumer operations', () => {
	it('should send json body when includeFile is false', async () => {
		const clientSpy = new httpClientSpy();

		const apioConsumer = new ApioConsumer();
		apioConsumer.client = clientSpy;

		const operation = getOperation();

		const properties = {
			name: 'name',
			surname: 'surname',
		};

		await apioConsumer.performOperation(operation, properties);

		expect(typeof clientSpy.body).toBe('string');
	});

	it('should send the correct content type header', async () => {
		const {apioConsumer, clientSpy} = getApioConsumerWithSpy();

		const operation = getOperation();

		const properties = {
			name: 'name',
			surname: 'surname',
		};

		await apioConsumer.performOperation(operation, properties, true);

		expect(clientSpy.body instanceof FormData).toBeTruthy();
	});

	it('should send the correct method', async () => {
		const {apioConsumer, clientSpy} = getApioConsumerWithSpy();

		const method = 'DELETE';

		const operation = getOperationWithMethod(method);

		await apioConsumer.performOperation(operation, {});

		expect(clientSpy.method).toBe(method);
	});

	it('should send the correct url', async () => {
		const {apioConsumer, clientSpy} = getApioConsumerWithSpy();

		const targetUrl = 'http://targeturl.com';

		const operation = getOperation(targetUrl);

		await apioConsumer.performOperation(operation, {});

		expect(clientSpy.url).toBe(targetUrl);
	});
});

describe('Apio consumer embedded and fields', () => {
	it('should set the correct parameters for embedded arguments', () => {
		const {apioConsumer, clientSpy} = getApioConsumerWithSpy();

		apioConsumer.fetchResource('', ['creator', 'headline']);

		expect(clientSpy.parameters).toMatchObject({
			embedded: 'creator,headline',
		});
	});

	it('should set the correct parameters for field arguments', () => {
		const {apioConsumer, clientSpy} = getApioConsumerWithSpy();

		apioConsumer.fetchResource('', null, {
			BlogPosting: ['creator, headline'],
			Person: ['name'],
		});

		expect(clientSpy.parameters).toMatchObject({
			'fields[BlogPosting]': 'creator, headline',
			'fields[Person]': 'name',
		});
	});
});

describe('Apio consumer converters', () => {
	it('should convert a thing when there is a converter available', async () => {
		const getMock = jest.fn().mockReturnValue(responseWithoutEmbbeded);
		const consumer = new ApioConsumer();
		consumer.client.get = getMock;

		const converter = thing => {
			return {name: thing.attributes.givenName};
		};

		consumer.addConverter('Person', converter);

		const converted = await consumer.fetchResource('');

		expect(converted.name).toBe('Loy');
	});

	it('should leave the thing unconverted when there is not any converter', async () => {
		const getMock = jest.fn().mockReturnValue(responseWithoutEmbbeded);
		const consumer = new ApioConsumer();
		ConversionHandler.CONVERTERS = {};

		consumer.client.get = getMock;

		const thing = await consumer.fetchResource('');

		expect(thing instanceof Thing).toBeTruthy();
	});

	it('should convert collections', async () => {
		const getMock = jest.fn().mockReturnValue(responseWithEmbbeded);
		const consumer = new ApioConsumer();
		ConversionHandler.CONVERTERS = {};

		consumer.client.get = getMock;

		const blogPostingConverter = thing => {
			return {headline: thing.attributes.headline};
		};

		consumer.addConverter('Collection', collectionConverter);
		consumer.addConverter('BlogPosting', blogPostingConverter);

		const collection = await consumer.fetchResource('');

		expect(collection instanceof Collection).toBeTruthy();

		expect(collection.items[0].headline).toBe('Death Be Not Proud');
	});

	it('should convert collections and items inside the collection', async () => {
		const getMock = jest.fn().mockReturnValue(responseWithEmbbeded);
		const consumer = new ApioConsumer();
		ConversionHandler.CONVERTERS = {};

		consumer.client.get = getMock;

		consumer.addConverter('Collection', collectionConverter);
		consumer.addConverter('');

		const thing = await consumer.fetchResource('');

		expect(thing instanceof Collection).toBeTruthy();
	});
});
