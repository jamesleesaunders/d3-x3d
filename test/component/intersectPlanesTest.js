import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Intersect Planes Component, component.intersectPlanes()", function() {
	let intersectPlanes = d3X3d.component.intersectPlanes();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(intersectPlanes.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			intersectPlanes.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(intersectPlanes.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(intersectPlanes.colors()).to.be.deep.equal(["blue", "red", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			intersectPlanes.colors(["orange", "cyan", "magenta"]);
			chai.expect(intersectPlanes.colors()).to.be.deep.equal(["orange", "cyan", "magenta"]);
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(intersectPlanes.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			intersectPlanes.xScale(0.2);
			chai.expect(intersectPlanes.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(intersectPlanes.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			intersectPlanes.yScale(0.1);
			chai.expect(intersectPlanes.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(intersectPlanes.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			intersectPlanes.zScale(0.2);
			chai.expect(intersectPlanes.zScale()).to.equal(0.2);
			done();
		});
	});
});
