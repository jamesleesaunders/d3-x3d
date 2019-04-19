let test = require('mocha');
let chai = require('chai');
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require('../');

test.describe('Test Random Data Generation', () => {
	let randomData = d3X3dom.randomData;
	let countries = ['UK', 'France', 'Spain', 'Germany', 'Italy', 'Portugal'];
	let fruit = ['Apples', 'Oranges', 'Pears', 'Bananas'];
	let data = randomData.dataset1();
	let keys = Object.keys(data);
	let key = Object.keys(data.key);
	let values = Object.keys(data.values);

	test.it('shoud return stores', (done) => {
		chai.expect(randomData.countries).to.be.deep.equal(countries);
		done();
	});

	test.it('shoud return fruits', (done) => {
		chai.expect(randomData.fruit).to.be.deep.equal(fruit);
		done();
	});

	test.it('shoud return random Dataset 1 Keys', (done) => {
		chai.expect(keys).to.be.deep.equal(['key', 'values']);
		done();
	});

	test.it('shoud return random Dataset 1 Keys', (done) => {
		chai.expect(key).to.be.deep.equal(['0', '1', '2', '3', '4']);
		done();
	});

	test.it('should return random Dataset 1 values', (done) => {
		chai.expect(values).to.be.deep.equal(['0', '1', '2', '3']);
		done();
	});
});
