import ApioConsumer from '../consumer/apio-consumer';

/**
 * Class for navigating accross the API
 * @review
 */
export default class Navigator {
	/**
	 * Creates a new Navigator
	 * @param {ApioConsumer} consumer
	 * @review
	 */
	constructor(consumer) {
		this.consumer = consumer;
		this.navigationSteps = [];
	}

	/**
	 * Add the entry point request to the navigation.
	 * @return {Navigator} the same instance to allow adding more navigation steps.
	 * @review
	 */
	getEntryPoint() {
		const url = this.getEntryPointUrl();

		const navigationStep = () => this.consumer.fetchResource(url);

		this.navigationSteps.push(navigationStep);

		return this;
	}

	/**
	 * Get the url of the entry point
	 * @review
	 */
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

	/**
	 * Get the final result after executing all steps
	 * @review
	 */
	get() {
		return this.executeSteps(this.navigationSteps);
	}

	/**
	 * Execute all steps
	 * @param {Array} steps
	 * @return {object}
	 * @review
	 */
	executeSteps(steps) {
		return steps.reduce(async (acc, step) => step(await acc), null);
	}
}
