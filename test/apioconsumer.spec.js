import ApioConsumer from '../src/consumer/apio-consumer';
import httpClientSpy from './doubles/client-spy';
import FormData from 'form-data';
import formResponse from './fixtures/response-form';

import {
	getOperation,
	getOperationWithForm,
	getOperationWithMethod,
} from './objectMother';

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
		const clientSpy = new httpClientSpy();

		const apioConsumer = new ApioConsumer();
		apioConsumer.client = clientSpy;

		const operation = getOperation();

		const properties = {
			name: 'name',
			surname: 'surname',
		};

		await apioConsumer.performOperation(operation, properties, true);

		expect(clientSpy.body instanceof FormData).toBeTruthy();
	});

	it('should send the correct method', async () => {
		const clientSpy = new httpClientSpy();

		const apioConsumer = new ApioConsumer();
		apioConsumer.client = clientSpy;

		const method = 'DELETE';

		const operation = getOperationWithMethod(method);

		await apioConsumer.performOperation(operation, {});

		expect(clientSpy.method).toBe(method);
	});

	it('should send the correct url', async () => {
		const clientSpy = new httpClientSpy();

		const apioConsumer = new ApioConsumer();
		apioConsumer.client = clientSpy;

		const targetUrl = 'http://targeturl.com';

		const operation = getOperation(targetUrl);

		await apioConsumer.performOperation(operation, {});

		expect(clientSpy.url).toBe(targetUrl);
	});
});
