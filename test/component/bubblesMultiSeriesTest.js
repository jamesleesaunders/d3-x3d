import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Multi Series Bubbles Component, component.bubbleMultiSeries()", function() {
	let bubblesMultiSeries = d3X3d.component.bubblesMultiSeries();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(bubblesMultiSeries.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			bubblesMultiSeries.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(bubblesMultiSeries.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(bubblesMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			bubblesMultiSeries.xScale(0.2);
			chai.expect(bubblesMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(bubblesMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			bubblesMultiSeries.yScale(0.1);
			chai.expect(bubblesMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(bubblesMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			bubblesMultiSeries.zScale(0.2);
			chai.expect(bubblesMultiSeries.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("Default sizeScale is undefined", function(done) {
			chai.expect(bubblesMultiSeries.sizeScale()).to.be.undefined;
			done();
		});
		test.it("Changed sizeScale is set", function(done) {
			bubblesMultiSeries.sizeScale(2);
			chai.expect(bubblesMultiSeries.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(bubblesMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			bubblesMultiSeries.colorScale(0.2);
			chai.expect(bubblesMultiSeries.colorScale()).to.equal(0.2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("Default sizeRange", function(done) {
			chai.expect(bubblesMultiSeries.sizeRange()).to.be.deep.equal([0.5, 3.0]);
			done();
		});
		test.it("Changed sizeRange", function(done) {
			bubblesMultiSeries.sizeRange([0.2, 5.0]);
			chai.expect(bubblesMultiSeries.sizeRange()).to.be.deep.equal([0.2, 5.0]);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(bubblesMultiSeries.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("Changed colors", function(done) {
			bubblesMultiSeries.colors(["steelblue", "green", "red", "yellow", "orange"]);
			chai.expect(bubblesMultiSeries.colors()).to.be.deep.equal(["steelblue", "green", "red", "yellow", "orange"]);
			done();
		});
	});
});
