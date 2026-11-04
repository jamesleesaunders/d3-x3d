import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Bars Component, component.bars()", function() {
	let bars = d3X3d.component.bars();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(bars.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 2 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			bars.dimensions({ x: 20, y: 20, z: 1 });
			chai.expect(bars.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 1 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(bars.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			bars.xScale(0.2);
			chai.expect(bars.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(bars.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			bars.yScale(0.1);
			chai.expect(bars.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(bars.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			bars.colorScale(2);
			chai.expect(bars.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(bars.colors()).to.be.deep.equal(["orange", "red", "yellow", "steelblue", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			bars.colors(["red", "blue", "orange", "cyan", "green"]);
			chai.expect(bars.colors()).to.be.deep.equal(["red", "blue", "orange", "cyan", "green"]);
			done();
		});
	});
});
