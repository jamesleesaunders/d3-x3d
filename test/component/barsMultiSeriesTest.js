import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Multi Series Bars Component, component.barMultiSeries()", function() {
	let barsMultiSeries = d3X3d.component.barsMultiSeries();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(barsMultiSeries.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			barsMultiSeries.dimensions({ x: 20, y: 20, z: 10 });
			chai.expect(barsMultiSeries.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 10 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(barsMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			barsMultiSeries.xScale(0.2);
			chai.expect(barsMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(barsMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			barsMultiSeries.yScale(0.1);
			chai.expect(barsMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(barsMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			barsMultiSeries.zScale(0.1);
			chai.expect(barsMultiSeries.zScale()).to.equal(0.1);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(barsMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			barsMultiSeries.colorScale(2);
			chai.expect(barsMultiSeries.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(barsMultiSeries.colors()).to.be.deep.equal(["orange", "red", "yellow", "steelblue", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			barsMultiSeries.colors(["red", "blue", "orange", "cyna", "green"]);
			chai.expect(barsMultiSeries.colors()).to.be.deep.equal(["red", "blue", "orange", "cyna", "green"]);
			done();
		});
	});
});
