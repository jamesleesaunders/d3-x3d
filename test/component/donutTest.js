import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Donut Component, component.donut()", function() {
	let donut = d3X3d.component.donut();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(donut.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			donut.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(donut.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(donut.colors()).to.be.deep.equal(["orange", "red", "yellow", "steelblue", "green"]);
			done();
		});
		test.it("Changed colors", function(done) {
			donut.colors(["red", "blue", "orange", "cyan", "green"]);
			chai.expect(donut.colors()).to.be.deep.equal(["red", "blue", "orange", "cyan", "green"]);
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(donut.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			donut.xScale(0.2);
			chai.expect(donut.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(donut.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			donut.yScale(0.1);
			chai.expect(donut.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(donut.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			donut.colorScale(2);
			chai.expect(donut.colorScale()).to.equal(2);
			done();
		});
	});
});
