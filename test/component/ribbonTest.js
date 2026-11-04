import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Ribbon Component, component.ribbon()", function() {
	let ribbon = d3X3d.component.ribbon();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(ribbon.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 5 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			ribbon.dimensions({ x: 80, y: 40, z: 10 });
			chai.expect(ribbon.dimensions()).to.be.deep.equal({ x: 80, y: 40, z: 10 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(ribbon.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			ribbon.xScale(0.2);
			chai.expect(ribbon.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(ribbon.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			ribbon.yScale(0.1);
			chai.expect(ribbon.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("Default color", function(done) {
			chai.expect(ribbon.color()).to.equal("red");
			done();
		});
		test.it("Changed color", function(done) {
			ribbon.color("steelblue");
			chai.expect(ribbon.color()).to.equal("steelblue");
			done();
		});
	});
});
