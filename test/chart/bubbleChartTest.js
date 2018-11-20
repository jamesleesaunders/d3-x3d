let test = require('tape');
let d3X3dom = require("../../");

test("Test Bubble Chart, bubbleChart()", function(t) {
	let bubbleChart = d3X3dom.chart.bubbleChart();

	// Test Getter/ Setter functions for width
	t.deepEqual(bubbleChart.width(), 500, "Default width should be 500");
	bubbleChart.width(300);
	t.deepEqual(bubbleChart.width(), 300);

	// Test Getter/ Setter functions for height
	t.deepEqual(bubbleChart.height(), 500, "Default height should be 500");
	bubbleChart.height(300);
	t.deepEqual(bubbleChart.height(), 300);

	// Test for Getter and setter function for dimensions
	t.deepEqual(bubbleChart.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	bubbleChart.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(bubbleChart.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	t.deepEqual(bubbleChart.xScale(), undefined, "xScale is undefined");
	bubbleChart.xScale(0.2);
	t.deepEqual(bubbleChart.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	t.deepEqual(bubbleChart.yScale(), undefined, "yScale is undefined");
	bubbleChart.yScale(0.1);
	t.deepEqual(bubbleChart.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	t.deepEqual(bubbleChart.zScale(), undefined, "zScale is undefined");
	bubbleChart.zScale(0.2);
	t.deepEqual(bubbleChart.zScale(), 0.2, "zScale changed");

	// Test for Getter and setter function for size Scale
	t.deepEqual(bubbleChart.sizeScale(), undefined, "size scale is undefined");
	bubbleChart.sizeScale(2);
	t.deepEqual(bubbleChart.sizeScale(), 2, "size scale changed");

	// Test for Getter and setter function for size domain
	t.deepEqual(bubbleChart.sizeDomain(), [0.5, 4.0], "size domain default is [0.5, 4.0]");
	bubbleChart.sizeDomain([0.2, 5.0]);
	t.deepEqual(bubbleChart.sizeDomain(), [0.2, 5.0], "size domain changed");

	// Test Getter/ Setter functions for colors
	t.deepEqual(bubbleChart.colors(), ["green", "red", "yellow", "steelblue", "orange"], 'Default colors should be ["green", "red", "yellow", "steelblue", "orange"]');
	bubbleChart.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(bubbleChart.colors(), ["orange", "yellow", "red", "steelblue", "green"]);

	// Test for Getter and setter function for color Scale
	t.deepEqual(bubbleChart.colorScale(), undefined, "colorScale is undefined");
	bubbleChart.colorScale(2);
	t.deepEqual(bubbleChart.colorScale(), 2, "colorScale changed");

	t.end()
});
