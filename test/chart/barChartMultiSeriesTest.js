let test = require('tape');
let d3X3dom = require("../../");

test("Test Multi Series Bar Chart, chart.barChartMultiSeries()", function(t) {
	let barChartMultiSeries = d3X3dom.chart.barChartMultiSeries();

	// Test Getter/ Setter functions for width
	t.deepEqual(barChartMultiSeries.width(), 500, "Default width");
	barChartMultiSeries.width(300);
	t.deepEqual(barChartMultiSeries.width(), 300, "Changed width");

	// Test Getter/ Setter functions for height
	t.deepEqual(barChartMultiSeries.height(), 500, "Default height");
	barChartMultiSeries.height(300);
	t.deepEqual(barChartMultiSeries.height(), 300, "Changed height");

	// Test Getter/ Setter functions for dimensions
	t.deepEqual(barChartMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	barChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
	t.deepEqual(barChartMultiSeries.dimensions(), { x: 20, y: 20, z: 20 }, "Changed dimensions");

	// Test for Getter and setter function for xScale
	t.deepEqual(barChartMultiSeries.xScale(), undefined, "Default xScale is undefined");
	barChartMultiSeries.xScale(0.2);
	t.deepEqual(barChartMultiSeries.xScale(), 0.2, "Changed xScale set");

	// Test for Getter and setter function for yScale
	t.deepEqual(barChartMultiSeries.yScale(), undefined, "Default yScale is undefined");
	barChartMultiSeries.yScale(0.1);
	t.deepEqual(barChartMultiSeries.yScale(), 0.1, "Changed yScale set");

	// Test for Getter and setter function for zScale
	t.deepEqual(barChartMultiSeries.zScale(), undefined, "Default zScale is undefined");
	barChartMultiSeries.zScale(0.2);
	t.deepEqual(barChartMultiSeries.zScale(), 0.2, "Changed zScale set");

	// Test for Getter and setter function for color Scale
	t.deepEqual(barChartMultiSeries.colorScale(), undefined, "Default colorScale is undefined");
	barChartMultiSeries.colorScale(2);
	t.deepEqual(barChartMultiSeries.colorScale(), 2, "Changed colorScale set");

	// Test Getter/ Setter functions for colors
	t.deepEqual(barChartMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	barChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(barChartMultiSeries.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test for Getter / Setter function for debug
	t.deepEqual(barChartMultiSeries.debug(), false, "Debug mode is false");
	barChartMultiSeries.debug(true);
	t.deepEqual(barChartMultiSeries.debug(), true, "Debug mode is true");

	t.end();
});
