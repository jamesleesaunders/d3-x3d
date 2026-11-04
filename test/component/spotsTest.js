import test from "mocha";
import * as chai from "chai";
import * as d3 from "d3";
import d3X3d from "../../index.js"

test.describe("Test Spots Component, component.spots()", function() {
	let spots = d3X3d.component.spots();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(spots.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			spots.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(spots.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(spots.colors()).to.be.deep.equal(d3.schemeRdYlGn[8]);
			done();
		});
		test.it("Changed colors", function(done) {
			spots.colors(["red", "green"]);
			chai.expect(spots.colors()).to.be.deep.equal(["red", "green"]);
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("Default color", function(done) {
			chai.expect(spots.color()).to.be.undefined;
			done();
		});
		test.it("Changed color", function(done) {
			spots.color("yellow");
			chai.expect(spots.color()).to.equal("yellow");
			done();
		});
	});

	// Test mappings getter / setter function
	test.describe("#mappings()", function() {
		test.it("Default mappings", function(done) {
			chai.expect(spots.mappings()).to.be.undefined;
			done();
		});
		test.it("Changed mappings", function(done) {
			spots.mappings({ x: "x", y: "y", z: "z", size: "size", color: "color" });
			chai.expect(spots.mappings()).to.be.deep.equal({ x: "x", y: "y", z: "z", size: "size", color: "color" });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(spots.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			spots.xScale(0.2);
			chai.expect(spots.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(spots.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			spots.yScale(0.1);
			chai.expect(spots.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(spots.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			spots.zScale(0.2);
			chai.expect(spots.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(spots.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			spots.colorScale(2);
			chai.expect(spots.colorScale()).to.equal(2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("Default sizeScale is undefined", function(done) {
			chai.expect(spots.sizeScale()).to.be.undefined;
			done();
		});
		test.it("Changed sizeScale is set", function(done) {
			spots.sizeScale(2);
			chai.expect(spots.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("Default sizeRange", function(done) {
			chai.expect(spots.sizeRange()).to.be.deep.equal([0.5, 3.5]);
			done();
		});
		test.it("Changed sizeRange", function(done) {
			spots.sizeRange([0.2, 5.0]);
			chai.expect(spots.sizeRange()).to.be.deep.equal([0.2, 5.0]);
			done();
		});
	});

	// Test plane getter / setter function
	test.describe("#plane()", function() {
		test.it("Default plane", function(done) {
			chai.expect(spots.plane()).to.equal("x");
			done();
		});
		test.it("Changed plane", function(done) {
			spots.plane("y");
			chai.expect(spots.plane()).to.equal("y");
			done();
		});
	});
});
