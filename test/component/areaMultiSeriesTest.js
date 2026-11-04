import test from "mocha";
import * as chai from "chai";
import * as d3 from "d3";
import d3X3d from "../../index.js"

test.describe("Test Multi Series Area Component, component.areaMultiSeries()", function() {
	let areaMultiSeries = d3X3d.component.areaMultiSeries();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(areaMultiSeries.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			areaMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
			chai.expect(areaMultiSeries.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 20 });
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(areaMultiSeries.colors()).to.be.deep.equal(["orange", "red", "yellow", "steelblue", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			areaMultiSeries.colors(["red", "blue", "orange", "cyan", "green"]);
			chai.expect(areaMultiSeries.colors()).to.be.deep.equal(["red", "blue", "orange", "cyan", "green"]);
			done();
		});
	});

	// Test smoothed getter / setter function
	test.describe("#smoothed()", function() {
		test.it("Default smoothed", function(done) {
			chai.expect(areaMultiSeries.smoothed()).to.equal(d3.curveMonotoneX);
			done();
		});
		test.it("Changed smoothed", function(done) {
			areaMultiSeries.smoothed(d3.curveBasis);
			chai.expect(areaMultiSeries.smoothed()).to.equal(d3.curveBasis);
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(areaMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			areaMultiSeries.xScale(0.2);
			chai.expect(areaMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(areaMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			areaMultiSeries.yScale(0.1);
			chai.expect(areaMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(areaMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			areaMultiSeries.zScale(0.2);
			chai.expect(areaMultiSeries.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(areaMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			areaMultiSeries.colorScale(2);
			chai.expect(areaMultiSeries.colorScale()).to.equal(2);
			done();
		});
	});
});
