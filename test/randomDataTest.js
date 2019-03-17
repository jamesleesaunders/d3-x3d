let chai = require('chai');
let expect = chai.expect;
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require('../');

describe('Test Random Data Generation', () => {
  let randomData = d3X3dom.randomData;
  let countries = ['UK', 'France', 'Spain', 'Germany', 'Italy', 'Portugal'];
  let fruit = ['Apples', 'Oranges', 'Pears', 'Bananas'];
  let data = randomData.dataset1();
  let keys = Object.keys(data);
  let key = Object.keys(data.key);
  let values = Object.keys(data.values);

  it('shoud return stores', (done) => {
    expect(randomData.countries).to.be.deep.equal(countries);
    done();
  });

  it('shoud return fruits', (done) => {
    expect(randomData.fruit).to.be.deep.equal(fruit);
    done();
  });

  it('shoud return random Dataset 1 Keys', (done) => {
    expect(keys).to.be.deep.equal(['key', 'values']);
    done();
  });

  it('shoud return random Dataset 1 Keys', (done) => {
    expect(key).to.be.deep.equal(['0', '1', '2', '3', '4']);
    done();
  });

  it('should return random Dataset 1 values', (done) => {
    expect(values).to.be.deep.equal(['0', '1', '2', '3']);
    done();
  });
});
