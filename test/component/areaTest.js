import test from "mocha";
import * as chai from "chai";
import * as d3 from "d3";
import d3X3d from "../../index.js"

test.describe("Test Area Component, component.area()", function() {
	let area = d3X3d.component.area();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(area.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 5 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			area.dimensions({ x: 80, y: 40, z: 10 });
			chai.expect(area.dimensions()).to.be.deep.equal({ x: 80, y: 40, z: 10 });
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("Default color", function(done) {
			chai.expect(area.color()).to.equal("blue");
			done();
		});
		test.it("Changed color", function(done) {
			area.color("red");
			chai.expect(area.color()).to.equal("red");
			done();
		});
	});

	// Test smoothed getter / setter function
	test.describe("#smoothed()", function() {
		test.it("Default smoothed", function(done) {
			chai.expect(area.smoothed()).to.equal(d3.curveMonotoneX);
			done();
		});
		test.it("Changed smoothed", function(done) {
			area.smoothed(d3.curveBasis);
			chai.expect(area.smoothed()).to.equal(d3.curveBasis);
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(area.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			area.xScale(0.2);
			chai.expect(area.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(area.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			area.yScale(0.1);
			chai.expect(area.yScale()).to.equal(0.1);
			done();
		});
	});
});
