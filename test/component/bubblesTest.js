import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Bubbles Component, component.bubbles()", function() {
	let bubbles = d3X3d.component.bubbles();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(bubbles.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			bubbles.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(bubbles.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(bubbles.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			bubbles.xScale(0.2);
			chai.expect(bubbles.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(bubbles.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			bubbles.yScale(0.1);
			chai.expect(bubbles.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(bubbles.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			bubbles.zScale(0.2);
			chai.expect(bubbles.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("Default sizeScale is undefined", function(done) {
			chai.expect(bubbles.sizeScale()).to.be.undefined;
			done();
		});
		test.it("Changed sizeScale is set", function(done) {
			bubbles.sizeScale(2);
			chai.expect(bubbles.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("Default sizeRange", function(done) {
			chai.expect(bubbles.sizeRange()).to.be.deep.equal([0.2, 4.0]);
			done();
		});
		test.it("Changed sizeRange", function(done) {
			bubbles.sizeRange([0.5, 5.0]);
			chai.expect(bubbles.sizeRange()).to.be.deep.equal([0.5, 5.0]);
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("Default color", function(done) {
			chai.expect(bubbles.color()).to.be.undefined;
			done();
		});
		test.it("Changed color", function(done) {
			bubbles.color("yellow");
			chai.expect(bubbles.color()).to.equal("yellow");
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(bubbles.colors()).to.be.deep.equal(["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"]);
			done();
		});
		test.it("Changed colors", function(done) {
			bubbles.colors(["red", "green"]);
			chai.expect(bubbles.colors()).to.be.deep.equal(["red", "green"]);
			done();
		});
	});
});
