let test = require("mocha");
let chai = require("chai");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test.describe("Test Multi Series Bar Chart, chart.barChartMultiSeries()", function() {
	let barChartMultiSeries = d3X3d.chart.barChartMultiSeries();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(barChartMultiSeries.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			barChartMultiSeries.width(300);
			chai.expect(barChartMultiSeries.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(barChartMultiSeries.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			barChartMultiSeries.height(300);
			chai.expect(barChartMultiSeries.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(barChartMultiSeries.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 20, y: 20, z: 20 }", function(done) {
			barChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
			chai.expect(barChartMultiSeries.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 20 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(barChartMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			barChartMultiSeries.xScale(0.2);
			chai.expect(barChartMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(barChartMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			barChartMultiSeries.yScale(0.1);
			chai.expect(barChartMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(barChartMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			barChartMultiSeries.zScale(0.2);
			chai.expect(barChartMultiSeries.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(barChartMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			barChartMultiSeries.colorScale(2);
			chai.expect(barChartMultiSeries.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to ...", function(done) {
			chai.expect(barChartMultiSeries.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("should be changed to ...", function(done) {
			barChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
			chai.expect(barChartMultiSeries.colors()).to.be.deep.equal(["orange", "yellow", "red", "steelblue", "green"]);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(barChartMultiSeries.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			barChartMultiSeries.debug(true);
			chai.expect(barChartMultiSeries.debug()).to.be.true;
			done();
		});
	});
});
