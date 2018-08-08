import ApioConsumer from '../consumer/apio-consumer';

/**
 * Class for navigating accross the API
 */
export default class Navigator {
	/**
	 * Creates a new Navigator
	 * @param {ApioConsumer} consumer
	 */
	constructor(consumer) {
		this.consumer = consumer;
		this.navigationSteps = [];
	}

	getEntryPoint() {
		const url = this.getEntryPointUrl();

		const navigationStep = () => this.consumer.fetchResource(url);

		this.navigationSteps.push(navigationStep);

		return this;
	}

	getEntryPointUrl() {
		return this.consumer.config + '/o/api';
	}

	collectionManaging(type) {
		const navigationStep = entryPoint => {
			const collectionId = entryPoint.getCollectionManaging(type);

			return this.consumer.fetchResource(collectionId);
		};

		this.navigationSteps.push(navigationStep);

		return this;
	}

	get() {
		return this.executeSteps(this.navigationSteps);
	}

	executeSteps(steps) {
		return steps.reduce(async (acc, step) => step(await acc), null);
	}
}
