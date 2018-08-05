import {collectionConverter} from './collection-converter';

/**
 * Apio consumer
 * @review
 */
class ConversionHandler {
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
				return converter(thing, this);
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

export {ConversionHandler};
