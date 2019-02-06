let test = require('tape');
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require("../../");

test("Test Multi Series Ribbon Chart, chart.ribbonChartMultiSeries()", function(t) {
	let ribbonChartMultiSeries = d3X3dom.chart.ribbonChartMultiSeries();

	// Test width getter / setter function
	t.equal(ribbonChartMultiSeries.width(), 500, "Default width");
	ribbonChartMultiSeries.width(300);
	t.equal(ribbonChartMultiSeries.width(), 300, "Changed width");

	// Test height getter / setter function
	t.equal(ribbonChartMultiSeries.height(), 500, "Default height");
	ribbonChartMultiSeries.height(300);
	t.equal(ribbonChartMultiSeries.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(ribbonChartMultiSeries.dimensions(), { x: 60, y: 40, z: 40 }, "Default dimensions");
	ribbonChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
	t.deepEqual(ribbonChartMultiSeries.dimensions(), { x: 20, y: 20, z: 20 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(ribbonChartMultiSeries.xScale(), undefined, "Default xScale is undefined");
	ribbonChartMultiSeries.xScale(0.2);
	t.equal(ribbonChartMultiSeries.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(ribbonChartMultiSeries.yScale(), undefined, "Default yScale is undefined");
	ribbonChartMultiSeries.yScale(0.1);
	t.equal(ribbonChartMultiSeries.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(ribbonChartMultiSeries.zScale(), undefined, "Default zScale is undefined");
	ribbonChartMultiSeries.zScale(0.2);
	t.equal(ribbonChartMultiSeries.zScale(), 0.2, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.equal(ribbonChartMultiSeries.colorScale(), undefined, "Default colorScale is undefined");
	ribbonChartMultiSeries.colorScale(2);
	t.equal(ribbonChartMultiSeries.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(ribbonChartMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	ribbonChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(ribbonChartMultiSeries.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test debug getter / setter function
	t.equal(ribbonChartMultiSeries.debug(), false, "Debug mode is false");
	ribbonChartMultiSeries.debug(true);
	t.equal(ribbonChartMultiSeries.debug(), true, "Debug mode is true");

	t.end();
});
