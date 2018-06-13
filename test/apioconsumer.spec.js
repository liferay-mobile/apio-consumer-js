import ApioConsumer from '../src/consumer/apio-consumer';
import Operation from '../src/model/operation';
import httpClientMock from './mocks/client-mock';

import formResponse from './fixtures/response-form';

describe('Apio consumer getOperation form', () => {
	it(`should throw a exception if the operation doesn't have a form`, async () => {
		const consumer = new ApioConsumer();

		const operationWithoutForm = new Operation(
			'test operation',
			'',
			'DELETE',
			null
		);

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
		const clientMock = new httpClientMock(formResponse);

		const consumer = new ApioConsumer();
		consumer.client = clientMock;

		const operationWithForm = new Operation(
			'test operation',
			'',
			'PUT',
			'http://validurl.com'
		);

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
