import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Viewpoint Base Component, component.viewpoint()", function() {
	let viewPoint = d3X3d.component.viewpoint();

	// Test centerOfRotation getter / setter function
	test.describe("#centerOfRotation()", function() {
		test.it("Default centerOfRotation", function(done) {
			chai.expect(viewPoint.centerOfRotation()).to.be.deep.equal([0.0, 0.0, 0.0]);
			done();
		});
		test.it("Changed centreOfRotation", function(done) {
			viewPoint.centerOfRotation([1.0, 1.0, 1.0]);
			chai.expect(viewPoint.centerOfRotation()).to.be.deep.equal([1.0, 1.0, 1.0]);
			done();
		});
	});

	// Test viewPosition getter / setter function
	test.describe("#viewPosition()", function() {
		test.it("Default viewPosition", function(done) {
			chai.expect(viewPoint.viewPosition()).to.be.deep.equal([80.0, 15.0, 80.0]);
			done();
		});
		test.it("Changed viewPosition", function(done) {
			viewPoint.viewPosition([100.0, 100.0, 100.0]);
			chai.expect(viewPoint.viewPosition()).to.be.deep.equal([100.0, 100.0, 100.0]);
			done();
		});
	});

	// Test viewOrientation getter / setter function
	test.describe("#viewOrientation()", function() {
		test.it("Default viewOrientation", function(done) {
			chai.expect(viewPoint.viewOrientation()).to.be.deep.equal([0.0, 1.0, 0.0, 0.8]);
			done();
		});
		test.it("Changed viewOrientation", function(done) {
			viewPoint.viewOrientation([1.0, 0.0, 0.0, 0.8]);
			chai.expect(viewPoint.viewOrientation()).to.be.deep.equal([1.0, 0.0, 0.0, 0.8]);
			done();
		});
	});

	// Test fieldOfView getter / setter function
	test.describe("#fieldOfView()", function() {
		test.it("Default fieldOfView", function(done) {
			chai.expect(viewPoint.fieldOfView()).to.equal(0.8);
			done();
		});
		test.it("Changed fieldOfView", function(done) {
			viewPoint.fieldOfView(1.0);
			chai.expect(viewPoint.fieldOfView()).to.equal(1.0);
			done();
		});
	});
});

test.describe("Test Component Viewpoint Quick View, viewpoint.quickView()", function() {
	let viewPoints = {
		left: {
			centerOfRotation: [0.0, 0.0, 0.0],
			viewPosition: [37.10119, 18.70484, 51.01594],
			viewOrientation: [0.06724, 0.99767, -0.01148, 0.33908],
			fieldOfView: 1.0
		},
		side: {
			centerOfRotation: [20.0, 0.0, 0.0],
			viewPosition: [20.00000, 20.00000, 50.00000],
			viewOrientation: [0.00000, 0.00000, 0.00000, 0.00000],
			fieldOfView: 1.0
		},
		top: {
			centerOfRotation: [0.0, 0.0, 0.0],
			viewPosition: [27.12955, 106.67181, 31.65828],
			viewOrientation: [-0.86241, 0.37490, 0.34013, 1.60141],
			fieldOfView: 1.0
		},
		dimetric: {
			centerOfRotation: [0.0, 0.0, 0.0],
			viewPosition: [80.0, 15.0, 80.0],
			viewOrientation: [0.0, 1.0, 0.0, 0.8],
			fieldOfView: 0.8
		}
	};

	test.describe("Test default values for left view", function() {
		let viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView("left");

		test.it("centerOfRotation", function(done) {
			chai.expect(viewPoint.centerOfRotation()).to.be.deep.equal(viewPoints.left.centerOfRotation);
			done();
		});
		test.it("viewPosition", function(done) {
			chai.expect(viewPoint.viewPosition()).to.be.deep.equal(viewPoints.left.viewPosition);
			done();
		});
		test.it("viewOrientation", function(done) {
			chai.expect(viewPoint.viewOrientation()).to.be.deep.equal(viewPoints.left.viewOrientation);
			done();
		});
		test.it("fieldOfView", function(done) {
			chai.expect(viewPoint.fieldOfView()).to.equal(viewPoints.left.fieldOfView);
			done();
		});
	});

	test.describe("Test default values for top view", function() {
		let viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView("top");

		test.it("centerOfRotation", function(done) {
			chai.expect(viewPoint.centerOfRotation()).to.be.deep.equal(viewPoints.top.centerOfRotation);
			done();
		});
		test.it("viewPosition", function(done) {
			chai.expect(viewPoint.viewPosition()).to.be.deep.equal(viewPoints.top.viewPosition);
			done();
		});
		test.it("viewOrientation", function(done) {
			chai.expect(viewPoint.viewOrientation()).to.be.deep.equal(viewPoints.top.viewOrientation);
			done();
		});
		test.it("fieldOfView", function(done) {
			chai.expect(viewPoint.fieldOfView()).to.equal(viewPoints.top.fieldOfView);
			done();
		});
	});

	test.describe("Test default values for side view", function() {
		let viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView("side");

		test.it("centerOfRotation", function(done) {
			chai.expect(viewPoint.centerOfRotation()).to.be.deep.equal(viewPoints.side.centerOfRotation);
			done();
		});
		test.it("viewPosition", function(done) {
			chai.expect(viewPoint.viewPosition()).to.be.deep.equal(viewPoints.side.viewPosition);
			done();
		});
		test.it("viewOrientation", function(done) {
			chai.expect(viewPoint.viewOrientation()).to.be.deep.equal(viewPoints.side.viewOrientation);
			done();
		});
		test.it("fieldOfView", function(done) {
			chai.expect(viewPoint.fieldOfView()).to.equal(viewPoints.side.fieldOfView);
			done();
		});
	});

	test.describe("Test default values for dimetric view", function() {
		let viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView("dimetric");

		test.it("centerOfRotation", function(done) {
			chai.expect(viewPoint.centerOfRotation()).to.be.deep.equal(viewPoints.dimetric.centerOfRotation);
			done();
		});
		test.it("viewPosition", function(done) {
			chai.expect(viewPoint.viewPosition()).to.be.deep.equal(viewPoints.dimetric.viewPosition);
			done();
		});
		test.it("viewOrientation", function(done) {
			chai.expect(viewPoint.viewOrientation()).to.be.deep.equal(viewPoints.dimetric.viewOrientation);
			done();
		});
		test.it("fieldOfView", function(done) {
			chai.expect(viewPoint.fieldOfView()).to.equal(viewPoints.dimetric.fieldOfView);
			done();
		});
	});
});
