import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Particle Plot, chart.particlePlot()", function() {
	let particlePlot = d3X3d.chart.particlePlot();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(particlePlot.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			particlePlot.width(300);
			chai.expect(particlePlot.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(particlePlot.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			particlePlot.height(300);
			chai.expect(particlePlot.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(particlePlot.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 10, y: 20, z: 30 }", function(done) {
			particlePlot.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(particlePlot.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(particlePlot.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			particlePlot.xScale(0.2);
			chai.expect(particlePlot.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(particlePlot.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			particlePlot.yScale(0.1);
			chai.expect(particlePlot.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(particlePlot.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			particlePlot.zScale(0.2);
			chai.expect(particlePlot.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(particlePlot.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			particlePlot.colorScale(2);
			chai.expect(particlePlot.colorScale()).to.equal(2);
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(particlePlot.color()).to.be.undefined;
			done();
		});
		test.it("should be changed to \"red\"", function(done) {
			particlePlot.color("red");
			chai.expect(particlePlot.color()).to.equal("red");
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to [\"orange\"]", function(done) {
			chai.expect(particlePlot.colors()).to.be.deep.equal(["orange"]);
			done();
		});
		test.it("should be changed to [\"red\", \"green\"]", function(done) {
			particlePlot.colors(["red", "green"]);
			chai.expect(particlePlot.colors()).to.be.deep.equal(["red", "green"]);
			done();
		});
	});

	// Test mappings getter / setter function
	test.describe("#mappings()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(particlePlot.mappings()).to.be.undefined;
			done();
		});
		test.it("should be changed to { x: \"x\", y: \"y\", z: \"z\", color: \"color\" }", function(done) {
			particlePlot.mappings({ x: "x", y: "y", z: "z", color: "color" });
			chai.expect(particlePlot.mappings()).to.be.deep.equal({ x: "x", y: "y", z: "z", color: "color" });
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(particlePlot.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			particlePlot.debug(true);
			chai.expect(particlePlot.debug()).to.be.true;
			done();
		});
	});
});
