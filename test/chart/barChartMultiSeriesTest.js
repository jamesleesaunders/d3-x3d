const tape = require('tape');
let d3X3dom = require("../../build/d3-x3dom");

tape("Test Bar Chart MultiSeries, barChartMultiSeries()", function(test) {
	let barChartMultiSeries = d3X3dom.chart.barChartMultiSeries();

	// Test Getter/ Setter functions for width
	test.deepEqual(barChartMultiSeries.width(), 500, "Default width should be 500");
	barChartMultiSeries.width(300);
	test.deepEqual(barChartMultiSeries.width(), 300);

	// Test Getter/ Setter functions for height
	test.deepEqual(barChartMultiSeries.height(), 500, "Default height should be 500");
	barChartMultiSeries.height(300);
	test.deepEqual(barChartMultiSeries.height(), 300);

	// Test Getter/ Setter functions for dimensions
	test.deepEqual(barChartMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions should be { x: 40, y: 40, z: 40 }");
	barChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
	test.deepEqual(barChartMultiSeries.dimensions(), { x: 20, y: 20, z: 20 });

	// Test Getter/ Setter functions for colors
	test.deepEqual(barChartMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], 'Default colors should be ["green", "red", "yellow", "steelblue", "orange"]');
	barChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
	test.deepEqual(barChartMultiSeries.colors(), ["orange", "yellow", "red", "steelblue", "green"]);

	// Test for Getter and setter function for color Scale
	test.deepEqual(barChartMultiSeries.colorScale(), undefined, "colorScale is undefined");
	barChartMultiSeries.colorScale(2);
	test.deepEqual(barChartMultiSeries.colorScale(), 2, "colorScale changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(barChartMultiSeries.xScale(), undefined, "xScale is undefined");
	barChartMultiSeries.xScale(0.2);
	test.deepEqual(barChartMultiSeries.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(barChartMultiSeries.yScale(), undefined, "yScale is undefined");
	barChartMultiSeries.yScale(0.1);
	test.deepEqual(barChartMultiSeries.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(barChartMultiSeries.zScale(), undefined, "zScale is undefined");
	barChartMultiSeries.zScale(0.2);
	test.deepEqual(barChartMultiSeries.zScale(), 0.2, "zScale changed");

	// Test for Getter / Setter function for debug
	test.deepEqual(barChartMultiSeries.debug(), false, "Show debug log and stats is set to false");
	barChartMultiSeries.debug(true);
	test.deepEqual(barChartMultiSeries.debug(), true);

	test.end()
});
