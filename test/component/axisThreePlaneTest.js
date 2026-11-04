import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Three Plane Axis Component, component.axisThreePlane()", function() {
	let axisThreePlane = d3X3d.component.axisThreePlane();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(axisThreePlane.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			axisThreePlane.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(axisThreePlane.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(axisThreePlane.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			axisThreePlane.xScale(0.2);
			chai.expect(axisThreePlane.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(axisThreePlane.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			axisThreePlane.yScale(0.1);
			chai.expect(axisThreePlane.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(axisThreePlane.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			axisThreePlane.zScale(0.2);
			chai.expect(axisThreePlane.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(axisThreePlane.colors()).to.be.deep.equal(["blue", "red", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			axisThreePlane.colors(["yellow", "blue", "green"]);
			chai.expect(axisThreePlane.colors()).to.be.deep.equal(["yellow", "blue", "green"]);
			done();
		});
	});

	// Test label position getter / setter function
	test.describe("#labelPosition()", function() {
		test.it("Label Position changed to distal", function(done) {
			axisThreePlane.labelPosition("distal");
			chai.expect(axisThreePlane.labelPosition()).to.equal("distal");
			done();
		});
	});
});
