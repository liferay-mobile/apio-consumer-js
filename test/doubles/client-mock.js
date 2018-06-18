export default class httpClientMock {
	constructor(response) {
		this.response = response;
	}

	async get() {
		return this.response;
	}
}
