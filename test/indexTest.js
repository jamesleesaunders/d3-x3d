let chai = require('chai');
let expect = chai.expect;
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require('../');

describe('Test Index', function () {
  let author = 'James Saunders';
  let license = 'GPL-2.0';
  let year = new Date().getFullYear();

  it('Returns author', function (done) {
    expect(d3X3dom.author).to.equal(author);
    done();
  })

  it('Returns license', function (done) {
    expect(d3X3dom.license).to.equal(license);
    done();
  })

  it('Returns copyright', function (done) {
    expect(d3X3dom.copyright).to.equal(`Copyright (C) ${year} ${author}`);
    done();
	  });

  it('Returns chart object', function (done) {
    expect(d3X3dom.chart).to.be.an('object');
    done();
	});

  it('Returns component object', function (done) {
    expect(d3X3dom.component).to.be.an('object');
    done();
	});
});
