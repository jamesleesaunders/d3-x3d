import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Crosshair Component, component.crosshair()", function() {
	let crosshair = d3X3d.component.crosshair();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(crosshair.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			crosshair.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(crosshair.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(crosshair.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			crosshair.xScale(5);
			chai.expect(crosshair.xScale()).to.equal(5);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(crosshair.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			crosshair.yScale(5);
			chai.expect(crosshair.yScale()).to.equal(5);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(crosshair.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			crosshair.zScale(5);
			chai.expect(crosshair.zScale()).to.equal(5);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(crosshair.colors()).to.be.deep.equal(["blue", "red", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			crosshair.colors(["orange", "cyan", "magenta"]);
			chai.expect(crosshair.colors()).to.be.deep.equal(["orange", "cyan", "magenta"]);
			done();
		});
	});
});
