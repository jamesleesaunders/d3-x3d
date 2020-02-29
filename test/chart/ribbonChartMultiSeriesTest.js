let test = require("mocha");
let chai = require("chai");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test.describe("Test Multi Series Ribbon Chart, chart.ribbonChartMultiSeries()", function() {
	let ribbonChartMultiSeries = d3X3d.chart.ribbonChartMultiSeries();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(ribbonChartMultiSeries.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			ribbonChartMultiSeries.width(300);
			chai.expect(ribbonChartMultiSeries.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(ribbonChartMultiSeries.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			ribbonChartMultiSeries.height(300);
			chai.expect(ribbonChartMultiSeries.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 60, y: 40, z: 40 }", function(done) {
			chai.expect(ribbonChartMultiSeries.dimensions()).to.be.deep.equal({ x: 60, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 20, y: 20, z: 20 }", function(done) {
			ribbonChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
			chai.expect(ribbonChartMultiSeries.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 20 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(ribbonChartMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			ribbonChartMultiSeries.xScale(0.2);
			chai.expect(ribbonChartMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(ribbonChartMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			ribbonChartMultiSeries.yScale(0.1);
			chai.expect(ribbonChartMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(ribbonChartMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			ribbonChartMultiSeries.zScale(0.2);
			chai.expect(ribbonChartMultiSeries.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(ribbonChartMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			ribbonChartMultiSeries.colorScale(2);
			chai.expect(ribbonChartMultiSeries.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to ...", function(done) {
			chai.expect(ribbonChartMultiSeries.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("should be changed to ...", function(done) {
			ribbonChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
			chai.expect(ribbonChartMultiSeries.colors()).to.be.deep.equal(["orange", "yellow", "red", "steelblue", "green"]);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(ribbonChartMultiSeries.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			ribbonChartMultiSeries.debug(true);
			chai.expect(ribbonChartMultiSeries.debug()).to.be.true;
			done();
		});
	});
});
