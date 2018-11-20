let test = require('tape');
let d3X3dom = require("../../");

test("Test Bar Chart MultiSeries, barChartMultiSeries()", function(t) {
	let barChartMultiSeries = d3X3dom.chart.barChartMultiSeries();

	// Test Getter/ Setter functions for width
	t.deepEqual(barChartMultiSeries.width(), 500, "Default width should be 500");
	barChartMultiSeries.width(300);
	t.deepEqual(barChartMultiSeries.width(), 300);

	// Test Getter/ Setter functions for height
	t.deepEqual(barChartMultiSeries.height(), 500, "Default height should be 500");
	barChartMultiSeries.height(300);
	t.deepEqual(barChartMultiSeries.height(), 300);

	// Test Getter/ Setter functions for dimensions
	t.deepEqual(barChartMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions should be { x: 40, y: 40, z: 40 }");
	barChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
	t.deepEqual(barChartMultiSeries.dimensions(), { x: 20, y: 20, z: 20 });

	// Test Getter/ Setter functions for colors
	t.deepEqual(barChartMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], 'Default colors should be ["green", "red", "yellow", "steelblue", "orange"]');
	barChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(barChartMultiSeries.colors(), ["orange", "yellow", "red", "steelblue", "green"]);

	// Test for Getter and setter function for color Scale
	t.deepEqual(barChartMultiSeries.colorScale(), undefined, "colorScale is undefined");
	barChartMultiSeries.colorScale(2);
	t.deepEqual(barChartMultiSeries.colorScale(), 2, "colorScale changed");

	// Test for Getter and setter function for xScale
	t.deepEqual(barChartMultiSeries.xScale(), undefined, "xScale is undefined");
	barChartMultiSeries.xScale(0.2);
	t.deepEqual(barChartMultiSeries.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	t.deepEqual(barChartMultiSeries.yScale(), undefined, "yScale is undefined");
	barChartMultiSeries.yScale(0.1);
	t.deepEqual(barChartMultiSeries.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	t.deepEqual(barChartMultiSeries.zScale(), undefined, "zScale is undefined");
	barChartMultiSeries.zScale(0.2);
	t.deepEqual(barChartMultiSeries.zScale(), 0.2, "zScale changed");

	// Test for Getter / Setter function for debug
	t.deepEqual(barChartMultiSeries.debug(), false, "Show debug log and stats is set to false");
	barChartMultiSeries.debug(true);
	t.deepEqual(barChartMultiSeries.debug(), true);

	t.end()
});
