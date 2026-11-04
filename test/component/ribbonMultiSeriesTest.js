import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Multi Series Ribbon Component, component.ribbon()", function() {
	let ribbonMultiSeries = d3X3d.component.ribbonMultiSeries();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(ribbonMultiSeries.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			ribbonMultiSeries.dimensions({ x: 80, y: 40, z: 10 });
			chai.expect(ribbonMultiSeries.dimensions()).to.be.deep.equal({ x: 80, y: 40, z: 10 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(ribbonMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			ribbonMultiSeries.xScale(0.2);
			chai.expect(ribbonMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(ribbonMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			ribbonMultiSeries.yScale(0.1);
			chai.expect(ribbonMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(ribbonMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			ribbonMultiSeries.zScale(0.1);
			chai.expect(ribbonMultiSeries.zScale()).to.equal(0.1);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(ribbonMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			ribbonMultiSeries.colorScale(2);
			chai.expect(ribbonMultiSeries.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(ribbonMultiSeries.colors()).to.be.deep.equal(["orange", "red", "yellow", "steelblue", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			ribbonMultiSeries.colors(["red", "blue", "orange", "cyna", "green"]);
			chai.expect(ribbonMultiSeries.colors()).to.be.deep.equal(["red", "blue", "orange", "cyna", "green"]);
			done();
		});
	});
});
