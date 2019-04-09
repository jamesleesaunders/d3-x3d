let chai = require('chai');
let mocha = require('mocha');
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require('../');

mocha.describe('Test Index', function() {
	let author = 'James Saunders';
	let license = 'GPL-2.0';
	let year = new Date().getFullYear();

	mocha.it('Returns author', function(done) {
		chai.expect(d3X3dom.author).to.equal(author);
		done();
	});

	mocha.it('Returns license', function(done) {
		chai.expect(d3X3dom.license).to.equal(license);
		done();
	});

	mocha.it('Returns copyright', function(done) {
		chai.expect(d3X3dom.copyright).to.equal(`Copyright (C) ${year} ${author}`);
		done();
	});

	mocha.it('Returns chart object', function(done) {
		chai.expect(d3X3dom.chart).to.be.an('object');
		done();
	});

	mocha.it('Returns component object', function(done) {
		chai.expect(d3X3dom.component).to.be.an('object');
		done();
	});
});
