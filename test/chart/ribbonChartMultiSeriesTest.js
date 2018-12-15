let test = require('tape');
let d3X3dom = require("../../");

test("Test Multi Series Ribbon Chart, chart.ribbonChartMultiSeries()", function(t) {
	let ribbonChartMultiSeries = d3X3dom.chart.ribbonChartMultiSeries();

	// Test Getter/ Setter functions for width
	t.deepEqual(ribbonChartMultiSeries.width(), 500, "Default width");
	ribbonChartMultiSeries.width(300);
	t.deepEqual(ribbonChartMultiSeries.width(), 300, "Changed width");

	// Test Getter/ Setter functions for height
	t.deepEqual(ribbonChartMultiSeries.height(), 500, "Default height");
	ribbonChartMultiSeries.height(300);
	t.deepEqual(ribbonChartMultiSeries.height(), 300, "Changed height");

	// Test Getter/ Setter functions for dimensions
	t.deepEqual(ribbonChartMultiSeries.dimensions(), { x: 60, y: 40, z: 40 }, "Default dimensions");
	ribbonChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
	t.deepEqual(ribbonChartMultiSeries.dimensions(), { x: 20, y: 20, z: 20 }, "Changed dimensions");

	// Test for Getter and setter function for xScale
	t.deepEqual(ribbonChartMultiSeries.xScale(), undefined, "Default xScale is undefined");
	ribbonChartMultiSeries.xScale(0.2);
	t.deepEqual(ribbonChartMultiSeries.xScale(), 0.2, "Changed xScale set");

	// Test for Getter and setter function for yScale
	t.deepEqual(ribbonChartMultiSeries.yScale(), undefined, "Default yScale is undefined");
	ribbonChartMultiSeries.yScale(0.1);
	t.deepEqual(ribbonChartMultiSeries.yScale(), 0.1, "Changed yScale set");

	// Test for Getter and setter function for zScale
	t.deepEqual(ribbonChartMultiSeries.zScale(), undefined, "Default zScale is undefined");
	ribbonChartMultiSeries.zScale(0.2);
	t.deepEqual(ribbonChartMultiSeries.zScale(), 0.2, "Changed zScale set");

	// Test for Getter and setter function for color Scale
	t.deepEqual(ribbonChartMultiSeries.colorScale(), undefined, "Default colorScale is undefined");
	ribbonChartMultiSeries.colorScale(2);
	t.deepEqual(ribbonChartMultiSeries.colorScale(), 2, "Changed colorScale set");

	// Test Getter/ Setter functions for colors
	t.deepEqual(ribbonChartMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	ribbonChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(ribbonChartMultiSeries.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test for Getter / Setter function for debug
	t.deepEqual(ribbonChartMultiSeries.debug(), false, "Debug mode is false");
	ribbonChartMultiSeries.debug(true);
	t.deepEqual(ribbonChartMultiSeries.debug(), true, "Debug mode is true");

	t.end();
});
