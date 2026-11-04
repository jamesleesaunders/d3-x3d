import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Label Component, component.label()", function() {
	let label = d3X3d.component.label();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(label.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			label.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(label.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("Default color", function(done) {
			chai.expect(label.color()).to.equal("black");
			done();
		});
		test.it("Changed color", function(done) {
			label.color("red");
			chai.expect(label.color()).to.equal("red");
			done();
		});
	});

	// Test offset getter / setter function
	test.describe("#offset()", function() {
		test.it("Default offset", function(done) {
			chai.expect(label.offset()).to.equal(0);
			done();
		});
		test.it("Changed offset", function(done) {
			label.offset(5);
			chai.expect(label.offset()).to.equal(5);
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(label.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			label.xScale(0.2);
			chai.expect(label.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(label.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			label.yScale(0.1);
			chai.expect(label.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(label.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			label.zScale(0.2);
			chai.expect(label.zScale()).to.equal(0.2);
			done();
		});
	});
});
