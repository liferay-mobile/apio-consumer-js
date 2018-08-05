import Thing from '../model/thing';
import Relation from '../model/relation';
import Operation from '../model/operation';

import {isObject, isObjectArray, filterProperties} from '../utils';

/**
 * Parser for extracting all the things from a json ld document
 * @review
 */
export default class JsonLDParser {
	/**
	 * Parses a thing from a json-ld document.
	 * Returns the top level thing, and all the embedded things
	 * @param {object} json
	 * @return {object}
	 * @review
	 */
	parseThing(json) {
		const id = json['@id'];
		const types = json['@type'];
		const context = json['@context'];
		const operations = this.parseOperations(json);

		const {attributes, things} = this.parseAttributes(json, context);

		const thing = new Thing(id, types, attributes, operations);
		return {thing, embeddedThings: things};
	}

	/**
	 * Parses the attributes of the thing, that can be other things
	 * @param {object} json
	 * @param {object} context
	 * @return {object}
	 * @review
	 */
	parseAttributes(json, context) {
		const filteredJson = filterProperties(json, '@id', '@context', '@type');

		return Object.keys(filteredJson).reduce(
			(acc, key) => this.flatten(context, acc, {key, value: json[key]}),
			{attributes: {}, things: {}}
		);
	}

	/**
	 * Parses the attribute, extracting all the thing within it and
	 * replacing them with a [Relation] {@link Relation}
	 * @param {object} context
	 * @param {object} foldedAttributes
	 * @param {Array} attribute
	 * @return {object}
	 * @review
	 */
	flatten(context, foldedAttributes, attribute) {
		let {attributes, things} = foldedAttributes;
		const {key, value} = attribute;

		if (isObject(value)) {
			this.parseObject(key, value, context, attributes, things);
		} else if (isObjectArray(value)) {
			this.parseObjectArray(key, value, context, attributes, things);
		} else if (this.isId(key, context)) {
			const relation = new Relation(value, null);

			things[value] = null;
			attributes[key] = relation;
		} else {
			attributes[key] = value;
		}

		return {attributes, things};
	}

	/**
	 * Parses an Object, extracting all the thing within it and
	 * replacing them with a [Relation] {@link Relation}
	 * @param {string} key
	 * @param {object} value
	 * @param {object} context
	 * @param {object} attributes
	 * @param {object} things
	 * @review
	 */
	parseObject(key, value, context, attributes, things) {
		if (this.isEmbbededThing(value)) {
			const {thing, embeddedThings} = this.parseThing(value);
			attributes[key] = new Relation(thing.id, thing);

			Object.assign(things, embeddedThings);

			things[thing.id] = thing;
		} else {
			const attributesAndThings = this.parseAttributes(value, context);
			attributes[key] = attributesAndThings.attributes;

			Object.assign(things, attributesAndThings.embeddedThings);
		}
	}

	/**
	 * Parses a Object Array, extracting all the thing within it and
	 * replacing them with a [Relation] {@link Relation}
	 * @param {string} key
	 * @param {Array<Object>} value
	 * @param {object} context
	 * @param {object} attributes
	 * @param {object} things
	 * @review
	 */
	parseObjectArray(key, value, context, attributes, things) {
		if (this.isEmbbededThingArray(value)) {
			const list = value.map(x => this.parseThing(x, things));
			let relations = [];
			for (const {thing, embeddedThings} of list) {
				const relation = new Relation(thing.id, thing);
				relations.push(relation);

				Object.assign(things, embeddedThings);

				things[thing.id] = thing;
			}

			attributes[key] = relations;
		} else {
			const list = value.map(x => this.parseAttributes(x, context));

			let attributeList = [];
			for (const attributesAndThings of list) {
				attributeList.push(attributesAndThings.attributes);

				Object.assign(things, attributesAndThings.embeddedThings);
			}

			attributes[key] = attributeList;
		}
	}

	/**
	 * Parses operations from a json array
	 * @param {object} json
	 * @return {Array<Operation>}
	 * @review
	 */
	parseOperations(json) {
		const operationsJson = json['operation'] || [];

		const operations = operationsJson.map(operationJson => {
			const id = operationJson['@id'];
			const target = operationJson['target'];
			const method = operationJson['method'];
			const expects = operationJson['expects'];
			const type = operationJson['@type'];

			return new Operation(id, target, method, expects, type);
		});

		return operations.reduce((acc, operation) => {
			acc[operation.id] = operation;
			return acc;
		}, {});
	}

	/**
	 * Check if the object passed is a embbeded thing
	 * @param {object} value
	 * @return {boolean}
	 * @review
	 */
	isEmbbededThing(value) {
		return value['@id'] != null;
	}

	/**
	 * Check if the array of object passed if an array of things
	 * @param {Array<Object>} value
	 * @return {boolean}
	 * @review
	 */
	isEmbbededThingArray(value) {
		return value[0]['@id'] != null;
	}

	/**
	 * Check if the giving name represents a thing id
	 * @param {String} name
	 * @param {object} context
	 * @return {boolean}
	 * @review
	 */
	isId(name, context) {
		if (context) {
			return (
				context.filter(
					value => value[name] && value[name]['@type'] === '@id'
				).length === 1
			);
		}
		return false;
	}
}
