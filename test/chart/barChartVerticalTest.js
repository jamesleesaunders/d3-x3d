const tape = require('tape');
let d3X3dom = require("../../build/d3-x3dom");

tape("Test Bar Chart Vertical, barChartVertical()", function(test) {
	let barChartVertical = d3X3dom.chart.barChartVertical();

	// Test Getter/ Setter functions for width
	test.deepEqual(barChartVertical.width(), 500, "Default width should be 500");
	barChartVertical.width(300);
	test.deepEqual(barChartVertical.width(), 300);

	// Test Getter/ Setter functions for height
	test.deepEqual(barChartVertical.height(), 500, "Default height should be 500");
	barChartVertical.height(300);
	test.deepEqual(barChartVertical.height(), 300);

	// Test Getter/ Setter functions for dimensions
	test.deepEqual(barChartVertical.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions should be { x: 40, y: 40, z: 40 }");
	barChartVertical.dimensions({ x: 20, y: 20, z: 20 });
	test.deepEqual(barChartVertical.dimensions(), { x: 20, y: 20, z: 20 });

	// Test Getter/ Setter functions for colors
	test.deepEqual(barChartVertical.colors(), ["green", "red", "yellow", "steelblue", "orange"], 'Default colors should be ["green", "red", "yellow", "steelblue", "orange"]');
	barChartVertical.colors(["orange", "yellow", "red", "steelblue", "green"]);
	test.deepEqual(barChartVertical.colors(), ["orange", "yellow", "red", "steelblue", "green"]);

	// Test for Getter and setter function for color Scale
	test.deepEqual(barChartVertical.colorScale(), undefined, "colorScale is undefined");
	barChartVertical.colorScale(2);
	test.deepEqual(barChartVertical.colorScale(), 2, "colorScale changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(barChartVertical.xScale(), undefined, "xScale is undefined");
	barChartVertical.xScale(0.2);
	test.deepEqual(barChartVertical.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(barChartVertical.yScale(), undefined, "yScale is undefined");
	barChartVertical.yScale(0.1);
	test.deepEqual(barChartVertical.yScale(), 0.1, "yScale changed");

	// Test for Getter / Setter function for debug
	test.deepEqual(barChartVertical.debug(), false, "Show debug log and stats is set to false");
	barChartVertical.debug(true);
	test.deepEqual(barChartVertical.debug(), true);

	test.end()
});
