let test = require("mocha");
let chai = require("chai");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test.describe("Test Scatter Plot Chart, chart.scatterPlot()", function() {
	let scatterPlot = d3X3d.chart.scatterPlot();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(scatterPlot.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			scatterPlot.width(300);
			chai.expect(scatterPlot.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(scatterPlot.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			scatterPlot.height(300);
			chai.expect(scatterPlot.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(scatterPlot.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 10, y: 20, z: 30 }", function(done) {
			scatterPlot.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(scatterPlot.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(scatterPlot.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			scatterPlot.xScale(0.2);
			chai.expect(scatterPlot.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(scatterPlot.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			scatterPlot.yScale(0.1);
			chai.expect(scatterPlot.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(scatterPlot.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			scatterPlot.zScale(0.1);
			chai.expect(scatterPlot.zScale()).to.equal(0.1);
			done();
		});
	});

	// Test color getter / setter function
	test.describe("#color()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(scatterPlot.color()).to.be.undefined;
			done();
		});
		test.it("should be changed to \"red\"", function(done) {
			scatterPlot.color("red");
			chai.expect(scatterPlot.color()).to.equal("red");
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to [\"orange\"]", function(done) {
			chai.expect(scatterPlot.colors()).to.be.deep.equal(["orange"]);
			done();
		});
		test.it("should be changed to [\"red\", \"green\"]", function(done) {
			scatterPlot.colors(["red", "green"]);
			chai.expect(scatterPlot.colors()).to.be.deep.equal(["red", "green"]);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(scatterPlot.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			scatterPlot.debug(true);
			chai.expect(scatterPlot.debug()).to.be.true;
			done();
		});
	});
});
