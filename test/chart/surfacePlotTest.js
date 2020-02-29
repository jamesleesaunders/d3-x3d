let test = require("mocha");
let chai = require("chai");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test.describe("Test Surface Plot Chart, chart.surfacePlot()", function() {
	let surfacePlot = d3X3d.chart.surfacePlot();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(surfacePlot.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			surfacePlot.width(300);
			chai.expect(surfacePlot.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(surfacePlot.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			surfacePlot.height(300);
			chai.expect(surfacePlot.height()).to.equal(300);
			done();
		});
	});


	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(surfacePlot.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 10, y: 20, z: 30 }", function(done) {
			surfacePlot.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(surfacePlot.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(surfacePlot.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			surfacePlot.xScale(0.2);
			chai.expect(surfacePlot.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(surfacePlot.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			surfacePlot.yScale(0.1);
			chai.expect(surfacePlot.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(surfacePlot.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			surfacePlot.zScale(0.1);
			chai.expect(surfacePlot.zScale()).to.equal(0.1);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(surfacePlot.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			surfacePlot.colorScale(2);
			chai.expect(surfacePlot.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to [\"blue\", \"red\"]", function(done) {
			chai.expect(surfacePlot.colors()).to.be.deep.equal(["blue", "red"]);
			done();
		});
		test.it("should be changed to [\"red\", \"green\"]", function(done) {
			surfacePlot.colors(["orange", "yellow"]);
			chai.expect(surfacePlot.colors()).to.be.deep.equal(["orange", "yellow"]);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(surfacePlot.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			surfacePlot.debug(true);
			chai.expect(surfacePlot.debug()).to.be.true;
			done();
		});
	});
});
