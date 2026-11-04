import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Axis Component, component.axis()", function() {
	let axis = d3X3d.component.axis();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(axis.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			axis.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(axis.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test scale getter / setter function
	test.describe("#scale()", function() {
		test.it("Default scale is undefined", function(done) {
			chai.expect(axis.scale()).to.be.undefined;
			done();
		});
		test.it("Changed scale is set", function(done) {
			axis.scale(5);
			chai.expect(axis.scale()).to.equal(5);
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("Default color", function(done) {
			chai.expect(axis.color()).to.equal("black");
			done();
		});
		test.it("Changed color", function(done) {
			axis.color("red");
			chai.expect(axis.color()).to.equal("red");
			done();
		});
	});

	// Test direction getter / setter function
	test.describe("#direction()", function() {
		test.it("Default direction is undefined", function(done) {
			chai.expect(axis.direction()).to.be.undefined;
			done();
		});
		test.it("Changed direction is set", function(done) {
			axis.direction("z");
			chai.expect(axis.direction()).to.equal("z");
			done();
		});
	});

	// Test tickDirection getter / setter function
	test.describe("#tickDirection()", function() {
		test.it("Default tickDirection is undefined", function(done) {
			chai.expect(axis.tickDirection()).to.be.undefined;
			done();
		});
		test.it("Changed tickDirection is set", function(done) {
			axis.tickDirection("x");
			chai.expect(axis.tickDirection()).to.equal("x");
			done();
		});
	});

	// Test tickValues getter / setter function
	test.describe("#tickValues()", function() {
		test.it("Default tickValues is null", function(done) {
			chai.expect(axis.tickValues()).to.be.null;
			done();
		});
		test.it("Changed tickValues is set", function(done) {
			axis.tickValues(["Apples", "Oranges", "Pears", "Bananas"]);
			chai.expect(axis.tickValues()).to.be.deep.equal(["Apples", "Oranges", "Pears", "Bananas"]);
			done();
		});
	});

	// Test tickArguments getter / setter function
	test.describe("#tickArguments()", function() {
		test.it("Default tickArguments is undefined", function(done) {
			chai.expect(axis.tickArguments()).to.be.deep.equal([]);
			done();
		});
		test.it("Changed tickArguments is set", function(done) {
			axis.tickArguments([10, 20, 30, 40, 50]);
			chai.expect(axis.tickArguments()).to.be.deep.equal([10, 20, 30, 40, 50]);
			done();
		});
	});

	// Test tickFormat getter / setter function
	test.describe("#tickFormat()", function() {
		test.it("Default tickArguments is null", function(done) {
			chai.expect(axis.tickFormat()).to.be.null;
			done();
		});
		test.it("Changd tickFormat is set", function(done) {
			axis.tickFormat("");
			chai.expect(axis.tickFormat()).to.equal("");
			done();
		});
	});

	// Test tickSize getter / setter function
	test.describe("#tickSize()", function() {
		test.it("Default tickSize", function(done) {
			chai.expect(axis.tickSize()).to.equal(1.5);
			done();
		});
		test.it("Changed tickSize is set", function(done) {
			axis.tickSize(5);
			chai.expect(axis.tickSize()).to.equal(5);
			done();
		});
	});

	// Test tickPadding getter / setter function
	test.describe("#tickPadding()", function() {
		test.it("Default tickPadding", function(done) {
			chai.expect(axis.tickPadding()).to.equal(2);
			done();
		});
		test.it("Changed tickPadding is set", function(done) {
			axis.tickPadding(5);
			chai.expect(axis.tickPadding()).to.equal(5);
			done();
		});
	});
});
