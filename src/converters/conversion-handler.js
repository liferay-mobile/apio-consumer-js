import {collectionConverter} from './collection-converter';
import ApioConsumer from '../consumer/apio-consumer';
import {entryPointConverter} from './entrypoint-converter';

/**
 * Apio consumer
 * @review
 */
class ConversionHandler {
	/**
	 * Creates a new conversion handler
	 * @param {ApioConsumer} consumer
	 */
	constructor(consumer) {
		this.consumer = consumer;
	}

	/**
	 * Convert the thing with the converte associated to its type, if any.
	 * If the thing has one or more types it will look for converters
	 * for the types in order and apply the first found.
	 * @param {Thing} thing
	 * @return {object}
	 * @review
	 */
	convert(thing) {
		for (const type of thing.types) {
			const converter = ConversionHandler.CONVERTERS[type];
			if (converter) {
				return converter(thing, this.consumer);
			}
		}

		return thing;
	}

	/**
	 * Add a converter for a type
	 * @param {string} type
	 * @param {function} converter
	 * @review
	 */
	addConverter(type, converter) {
		ConversionHandler.CONVERTERS[type] = converter;
	}
}

ConversionHandler.CONVERTERS = {};
ConversionHandler.CONVERTERS['Collection'] = collectionConverter;
ConversionHandler.CONVERTERS['EntryPoint'] = entryPointConverter;

export {ConversionHandler};
