let test = require('tape');
let d3X3dom = require("../../");

test("Test Vertical Bar Chart, chart.barChartVertical()", function(t) {
	let barChartVertical = d3X3dom.chart.barChartVertical();

	// Test Getter/ Setter functions for width
	t.deepEqual(barChartVertical.width(), 500, "Default width");
	barChartVertical.width(300);
	t.deepEqual(barChartVertical.width(), 300, "Changed width");

	// Test Getter/ Setter functions for height
	t.deepEqual(barChartVertical.height(), 500, "Default height");
	barChartVertical.height(300);
	t.deepEqual(barChartVertical.height(), 300, "Changed height");

	// Test Getter/ Setter functions for dimensions
	t.deepEqual(barChartVertical.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	barChartVertical.dimensions({ x: 20, y: 20, z: 20 });
	t.deepEqual(barChartVertical.dimensions(), { x: 20, y: 20, z: 20 }, "Changed dimensions");

	// Test for Getter and setter function for xScale
	t.deepEqual(barChartVertical.xScale(), undefined, "Default xScale is undefined");
	barChartVertical.xScale(0.2);
	t.deepEqual(barChartVertical.xScale(), 0.2, "Changed xScale set");

	// Test for Getter and setter function for yScale
	t.deepEqual(barChartVertical.yScale(), undefined, "Default yScale is undefined");
	barChartVertical.yScale(0.1);
	t.deepEqual(barChartVertical.yScale(), 0.1, "Changed yScale set");

	// Test for Getter and setter function for color Scale
	t.deepEqual(barChartVertical.colorScale(), undefined, "Default colorScale is undefined");
	barChartVertical.colorScale(2);
	t.deepEqual(barChartVertical.colorScale(), 2, "Changed colorScale set");

	// Test Getter/ Setter functions for colors
	t.deepEqual(barChartVertical.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	barChartVertical.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(barChartVertical.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test for Getter / Setter function for debug
	t.deepEqual(barChartVertical.debug(), false, "Debug mode is false");
	barChartVertical.debug(true);
	t.deepEqual(barChartVertical.debug(), true, "Debug mode is true");

	t.end();
});
