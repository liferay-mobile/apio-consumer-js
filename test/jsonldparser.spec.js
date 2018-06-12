import JsonLDParser from '../src/parser/jsonldparser';
import responseWithoutEmbbeded from './fixtures/response-without-embbeded';
import responseWithEmbbeded from './fixtures/response-with-embbeded';
import responseWithOperations from './fixtures/response-with-operations';
import Relation from '../src/model/relation';
import Thing from '../src/model/thing';

describe('JsonLDParser withouth embedded', () => {
	it('should parse the thing', () => {
		const parser = new JsonLDParser();

		const {thing, _} = parser.parseThing(responseWithoutEmbbeded);

		expect(thing.id).toBe('https://apiosample.wedeploy.io/p/people/9');
		expect(thing.types).toEqual(['Person']);
		expect(thing.attributes.name).toBe('Loy Hermiston');
	});

	it('should parse nested array', () => {
		const parser = new JsonLDParser();

		const {thing, _} = parser.parseThing(responseWithoutEmbbeded);

		expect(thing.attributes.jobTitle).toEqual([
			'Dynamic Tactics Orchestrator',
		]);
	});

	it('should parse nested objects', () => {
		const parser = new JsonLDParser();

		const {thing, _} = parser.parseThing(responseWithoutEmbbeded);
		const address = thing.attributes.address;

		expect(address.streetAddress).toBe('1228 Ada Shoal');
	});
});

describe('JsonParser with embbeded things', () => {
	it('should replace id with relation', () => {
		const parser = new JsonLDParser();

		const {thing, _} = parser.parseThing(responseWithEmbbeded);

		const view = thing.attributes.view;

		expect(view instanceof Relation).toBeTruthy();
	});

	it('should replace embedded thing with relation', () => {
		const parser = new JsonLDParser();

		const {thing, _} = parser.parseThing(responseWithEmbbeded);

		const view = thing.attributes.view;
		const firstMember = thing.attributes.member[0];

		expect(view instanceof Relation).toBeTruthy();
		expect(firstMember instanceof Relation).toBeTruthy();
	});

	it('should return the embedded ids in a separate array', () => {
		const parser = new JsonLDParser();

		const {_, embeddedThings} = parser.parseThing(responseWithEmbbeded);

		expect(Object.keys(embeddedThings).length).toBe(4);
	});

	it('should return the embbeded things indexed by the same id found in the relation', () => {
		const parser = new JsonLDParser();

		const {thing, embeddedThings} = parser.parseThing(responseWithEmbbeded);

		const viewRelation = thing.attributes.view;
		const firstMemberRelation = thing.attributes.member[0];

		const view = embeddedThings[viewRelation.id];
		const firstMember = embeddedThings[firstMemberRelation.id];

		expect(view instanceof Thing).toBeTruthy();
		expect(firstMember instanceof Thing).toBeTruthy();

		expect(view.attributes.first).toBe(
			'https://apiosample.wedeploy.io/p/blog-postings?page=1&per_page=30'
		);
		expect(firstMember.attributes.headline).toBe('Death Be Not Proud');
	});

	it('should return the embbeded thing in the relation', () => {
		const parser = new JsonLDParser();

		const {thing, embeddedThings} = parser.parseThing(responseWithEmbbeded);

		const firstMemberRelation = thing.attributes.member[0];
		const firstMember = firstMemberRelation.thing;

		expect(firstMember.attributes.headline).toBe('Death Be Not Proud');
	});
});

describe('JsonParser with operations', () => {
	it('parses the operations', () => {
		const parser = new JsonLDParser();

		const {thing, _} = parser.parseThing(responseWithOperations);

		const operations = thing.operations;

		const deleteOperation = thing.operations['_:people/delete'];

		expect(operations).not.toBeNull();
		expect(deleteOperation.method).toBe('DELETE');
	});
});
