import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Multi Series Spots Component, component.spotsMultiSeries()", function() {
	let spotsMultiSeries = d3X3d.component.spotsMultiSeries();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(spotsMultiSeries.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			spotsMultiSeries.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(spotsMultiSeries.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(spotsMultiSeries.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("Changed colors", function(done) {
			spotsMultiSeries.colors(["steelblue", "green", "red", "yellow", "orange"]);
			chai.expect(spotsMultiSeries.colors()).to.be.deep.equal(["steelblue", "green", "red", "yellow", "orange"]);
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(spotsMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			spotsMultiSeries.xScale(0.2);
			chai.expect(spotsMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(spotsMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			spotsMultiSeries.yScale(0.1);
			chai.expect(spotsMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(spotsMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			spotsMultiSeries.zScale(0.2);
			chai.expect(spotsMultiSeries.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(spotsMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			spotsMultiSeries.colorScale(2);
			chai.expect(spotsMultiSeries.colorScale()).to.equal(2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("Default sizeScale is undefined", function(done) {
			chai.expect(spotsMultiSeries.sizeScale()).to.be.undefined;
			done();
		});
		test.it("Changed sizeScale is set", function(done) {
			spotsMultiSeries.sizeScale(2);
			chai.expect(spotsMultiSeries.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("Default sizeRange", function(done) {
			chai.expect(spotsMultiSeries.sizeRange()).to.be.deep.equal([0.5, 3.0]);
			done();
		});
		test.it("Changed sizeRange", function(done) {
			spotsMultiSeries.sizeRange([0.2, 5.0]);
			chai.expect(spotsMultiSeries.sizeRange()).to.be.deep.equal([0.2, 5.0]);
			done();
		});
	});
});
