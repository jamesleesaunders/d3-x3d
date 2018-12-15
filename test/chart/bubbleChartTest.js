let test = require('tape');
let d3X3dom = require("../../");

test("Test Bubble Chart, chart.bubbleChart()", function(t) {
	let bubbleChart = d3X3dom.chart.bubbleChart();

	// Test Getter/ Setter functions for width
	t.deepEqual(bubbleChart.width(), 500, "Default width");
	bubbleChart.width(300);
	t.deepEqual(bubbleChart.width(), 300, "Changed width");

	// Test Getter/ Setter functions for height
	t.deepEqual(bubbleChart.height(), 500, "Default height");
	bubbleChart.height(300);
	t.deepEqual(bubbleChart.height(), 300, "Changed height");

	// Test for Getter and setter function for dimensions
	t.deepEqual(bubbleChart.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	bubbleChart.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(bubbleChart.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test for Getter and setter function for xScale
	t.deepEqual(bubbleChart.xScale(), undefined, "Default xScale is undefined");
	bubbleChart.xScale(0.2);
	t.deepEqual(bubbleChart.xScale(), 0.2, "Changed xScale set");

	// Test for Getter and setter function for yScale
	t.deepEqual(bubbleChart.yScale(), undefined, "Default yScale is undefined");
	bubbleChart.yScale(0.1);
	t.deepEqual(bubbleChart.yScale(), 0.1, "Changed yScale set");

	// Test for Getter and setter function for zScale
	t.deepEqual(bubbleChart.zScale(), undefined, "Default zScale is undefined");
	bubbleChart.zScale(0.2);
	t.deepEqual(bubbleChart.zScale(), 0.2, "Changed zScale set");

	// Test for Getter and setter function for color Scale
	t.deepEqual(bubbleChart.colorScale(), undefined, "Default colorScale is undefined");
	bubbleChart.colorScale(2);
	t.deepEqual(bubbleChart.colorScale(), 2, "Changed colorScale set");

	// Test for Getter and setter function for size Scale
	t.deepEqual(bubbleChart.sizeScale(), undefined, "Default sizeScale is undefined");
	bubbleChart.sizeScale(2);
	t.deepEqual(bubbleChart.sizeScale(), 2, "Changed sizeScale set");

	// Test for Getter and setter function for size domain
	t.deepEqual(bubbleChart.sizeDomain(), [0.5, 3.5], "Default sizeDdomain");
	bubbleChart.sizeDomain([0.2, 5.0]);
	t.deepEqual(bubbleChart.sizeDomain(), [0.2, 5.0], "Changed sizeDdomain");

	// Test Getter/ Setter functions for colors
	t.deepEqual(bubbleChart.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	bubbleChart.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(bubbleChart.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test for Getter / Setter function for debug
	t.deepEqual(bubbleChart.debug(), false, "Debug mode is false");
	bubbleChart.debug(true);
	t.deepEqual(bubbleChart.debug(), true, "Debug mode is true");

	t.end();
});
