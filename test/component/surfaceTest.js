import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Surface Area Component, component.surface()", function() {
	let surfaceArea = d3X3d.component.surface();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(surfaceArea.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			surfaceArea.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(surfaceArea.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(surfaceArea.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			surfaceArea.xScale(0.2);
			chai.expect(surfaceArea.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(surfaceArea.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			surfaceArea.yScale(0.1);
			chai.expect(surfaceArea.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(surfaceArea.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			surfaceArea.zScale(0.2);
			chai.expect(surfaceArea.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(surfaceArea.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			surfaceArea.colorScale(2);
			chai.expect(surfaceArea.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(surfaceArea.colors()).to.be.deep.equal(["blue", "red"]);
			done();
		});
		test.it("Changed colors", function(done) {
			surfaceArea.colors(["orange", "maroon"]);
			chai.expect(surfaceArea.colors()).to.be.deep.equal(["orange", "maroon"]);
			done();
		});
	});
});
