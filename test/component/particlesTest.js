import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Particles Component, component.particles()", function() {
	let particles = d3X3d.component.particles();

	test.it("Test", function(done) {
		chai.expect("test").to.equal("test");
		done();
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(particles.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			particles.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(particles.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("Default xScale is undefined", function(done) {
			chai.expect(particles.xScale()).to.be.undefined;
			done();
		});
		test.it("Changed xScale is set", function(done) {
			particles.xScale(0.2);
			chai.expect(particles.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("Default yScale is undefined", function(done) {
			chai.expect(particles.yScale()).to.be.undefined;
			done();
		});
		test.it("Changed yScale is set", function(done) {
			particles.yScale(0.1);
			chai.expect(particles.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("Default zScale is undefined", function(done) {
			chai.expect(particles.zScale()).to.be.undefined;
			done();
		});
		test.it("Changed zScale is set", function(done) {
			particles.zScale(0.2);
			chai.expect(particles.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("Default color", function(done) {
			chai.expect(particles.color()).to.be.undefined;
			done();
		});
		test.it("Changed color", function(done) {
			particles.color("yellow");
			chai.expect(particles.color()).to.equal("yellow");
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("Default colors", function(done) {
			chai.expect(particles.colors()).to.be.deep.equal(["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"]);
			done();
		});
		test.it("Changed colors", function(done) {
			particles.colors(["red", "green"]);
			chai.expect(particles.colors()).to.be.deep.equal(["red", "green"]);
			done();
		});
	});
});
