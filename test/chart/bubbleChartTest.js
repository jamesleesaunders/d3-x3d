const tape = require('tape');
let d3X3dom = require("../../build/d3-x3dom");

tape("Test Bubble Chart, bubbleChart()", function(test) {
	let bubbleChart = d3X3dom.chart.bubbleChart();

	// Test Getter/ Setter functions for width
	test.deepEqual(bubbleChart.width(), 500, "Default width should be 500");
	bubbleChart.width(300);
	test.deepEqual(bubbleChart.width(), 300);

	// Test Getter/ Setter functions for height
	test.deepEqual(bubbleChart.height(), 500, "Default height should be 500");
	bubbleChart.height(300);
	test.deepEqual(bubbleChart.height(), 300);

	// Test for Getter and setter function for dimensions
	test.deepEqual(bubbleChart.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	bubbleChart.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(bubbleChart.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(bubbleChart.xScale(), undefined, "xScale is undefined");
	bubbleChart.xScale(0.2);
	test.deepEqual(bubbleChart.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(bubbleChart.yScale(), undefined, "yScale is undefined");
	bubbleChart.yScale(0.1);
	test.deepEqual(bubbleChart.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(bubbleChart.zScale(), undefined, "zScale is undefined");
	bubbleChart.zScale(0.2);
	test.deepEqual(bubbleChart.zScale(), 0.2, "zScale changed");

	// Test for Getter and setter function for size Scale
	test.deepEqual(bubbleChart.sizeScale(), undefined, "size scale is undefined");
	bubbleChart.sizeScale(2);
	test.deepEqual(bubbleChart.sizeScale(), 2, "size scale changed");

	// Test for Getter and setter function for size domain
	test.deepEqual(bubbleChart.sizeDomain(), [0.5, 4.0], "size domain default is [0.5, 4.0]");
	bubbleChart.sizeDomain([0.2, 5.0]);
	test.deepEqual(bubbleChart.sizeDomain(), [0.2, 5.0], "size domain changed");

	// Test Getter/ Setter functions for colors
	test.deepEqual(bubbleChart.colors(), ["green", "red", "yellow", "steelblue", "orange"], 'Default colors should be ["green", "red", "yellow", "steelblue", "orange"]');
	bubbleChart.colors(["orange", "yellow", "red", "steelblue", "green"]);
	test.deepEqual(bubbleChart.colors(), ["orange", "yellow", "red", "steelblue", "green"]);

	// Test for Getter and setter function for color Scale
	test.deepEqual(bubbleChart.colorScale(), undefined, "colorScale is undefined");
	bubbleChart.colorScale(2);
	test.deepEqual(bubbleChart.colorScale(), 2, "colorScale changed");

	test.end()
});
