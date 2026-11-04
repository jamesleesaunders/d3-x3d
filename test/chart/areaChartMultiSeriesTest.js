import test from "mocha";
import * as chai from "chai";
import * as d3 from "d3";
import d3X3d from "../../index.js"

test.describe("Test Multi Series Area Chart, chart.areaChartMultiSeries()", function() {
	let areaChartMultiSeries = d3X3d.chart.areaChartMultiSeries();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(areaChartMultiSeries.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			areaChartMultiSeries.width(300);
			chai.expect(areaChartMultiSeries.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(areaChartMultiSeries.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			areaChartMultiSeries.height(300);
			chai.expect(areaChartMultiSeries.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 60, y: 40, z: 40 }", function(done) {
			chai.expect(areaChartMultiSeries.dimensions()).to.be.deep.equal({ x: 60, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 20, y: 20, z: 20 }", function(done) {
			areaChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
			chai.expect(areaChartMultiSeries.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 20 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(areaChartMultiSeries.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			areaChartMultiSeries.xScale(0.2);
			chai.expect(areaChartMultiSeries.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(areaChartMultiSeries.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			areaChartMultiSeries.yScale(0.1);
			chai.expect(areaChartMultiSeries.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(areaChartMultiSeries.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			areaChartMultiSeries.zScale(0.2);
			chai.expect(areaChartMultiSeries.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(areaChartMultiSeries.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			areaChartMultiSeries.colorScale(2);
			chai.expect(areaChartMultiSeries.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to ...", function(done) {
			chai.expect(areaChartMultiSeries.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("should be changed to ...", function(done) {
			areaChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
			chai.expect(areaChartMultiSeries.colors()).to.be.deep.equal(["orange", "yellow", "red", "steelblue", "green"]);
			done();
		});
	});

	// Test smoothed getter / setter function
	test.describe("#smoothed()", function() {
		test.it("should default to curveMonotoneX", function(done) {
			chai.expect(areaChartMultiSeries.smoothed()).to.equal(d3.curveMonotoneX);
			done();
		});
		test.it("should be changed to curveBasis", function(done) {
			areaChartMultiSeries.smoothed(d3.curveBasis);
			chai.expect(areaChartMultiSeries.smoothed()).to.equal(d3.curveBasis);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(areaChartMultiSeries.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			areaChartMultiSeries.debug(true);
			chai.expect(areaChartMultiSeries.debug()).to.be.true;
			done();
		});
	});
});
