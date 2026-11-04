import test from "mocha";
import * as chai from "chai";
import * as d3 from "d3";
import d3X3d from "../../index.js"

test.describe("Test Vector Fields Component, component.vectorFields()", function() {
	let vectorFields = d3X3d.component.vectorFields();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(vectorFields.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			vectorFields.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(vectorFields.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(vectorFields.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			vectorFields.xScale(0.2);
			chai.expect(vectorFields.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(vectorFields.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			vectorFields.yScale(0.1);
			chai.expect(vectorFields.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(vectorFields.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			vectorFields.zScale(0.2);
			chai.expect(vectorFields.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("Default sizeScale is undefined", function(done) {
			chai.expect(vectorFields.sizeScale()).to.be.undefined;
			done();
		});
		test.it("Changed sizeScale is set", function(done) {
			vectorFields.sizeScale(2);
			chai.expect(vectorFields.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("Default sizeRange", function(done) {
			chai.expect(vectorFields.sizeRange()).to.be.deep.equal([2.0, 5.0]);
			done();
		});
		test.it("Changed sizeRange", function(done) {
			vectorFields.sizeRange([3.5, 7.0]);
			chai.expect(vectorFields.sizeRange()).to.be.deep.equal([3.5, 7.0]);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("Default colorScale is undefined", function(done) {
			chai.expect(vectorFields.colorScale()).to.be.undefined;
			done();
		});
		test.it("Changed colorScale is set", function(done) {
			vectorFields.colorScale(2);
			chai.expect(vectorFields.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(vectorFields.colors()).to.be.deep.equal(["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"]);
			done();
		});
		test.it("Changed colors", function(done) {
			vectorFields.colors(d3.schemePurples[4]);
			chai.expect(vectorFields.colors()).to.be.deep.equal(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"]);
			done();
		});
	});

	// Test vectorFunction getter / setter function
	test.describe("#vectorFunction()", function() {
		test.it("Default vectorFunction", function(done) {
			chai.expect(vectorFields.vectorFunction()).to.be.a("function");
			done();
		});
		test.it("Changed vectorFunction", function(done) {
			vectorFields.vectorFunction(() => "Hello World");
			chai.expect(vectorFields.vectorFunction()()).to.equal("Hello World");
			done();
		});
	});
});
