const tape = require('tape');
let d3X3dom = require("../../build/d3-x3dom");

tape("Test Scatter Plot base, scatterPlot()", function(test) {
	let scatterPlot = d3X3dom.chart.scatterPlot();

	// Test Getter/ Setter functions for width
	test.deepEqual(scatterPlot.width(), 500, "Default width should be 500");
	scatterPlot.width(300);
	test.deepEqual(scatterPlot.width(), 300);

	// Test Getter/ Setter functions for height
	test.deepEqual(scatterPlot.height(), 500, "Default height should be 500");
	scatterPlot.height(300);
	test.deepEqual(scatterPlot.height(), 300);

	// Test for Getter and setter function for dimensions
	test.deepEqual(scatterPlot.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	scatterPlot.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(scatterPlot.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(scatterPlot.xScale(), undefined, "xScale is undefined");
	scatterPlot.xScale(0.2);
	test.deepEqual(scatterPlot.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(scatterPlot.yScale(), undefined, "yScale is undefined");
	scatterPlot.yScale(0.1);
	test.deepEqual(scatterPlot.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(scatterPlot.zScale(), undefined, "zScale is undefined");
	scatterPlot.zScale(0.1);
	test.deepEqual(scatterPlot.zScale(), 0.1, "zScale changed");

	// Test for Getter and setter function for color
	test.deepEqual(scatterPlot.color(), "orange", "Default color is orange");
	scatterPlot.color("red");
	test.deepEqual(scatterPlot.color(), "red");

	// Test for Getter and Setter function for debug
	test.deepEqual(scatterPlot.debug(), false, "Show debug log and stats is set to false");
	scatterPlot.debug(true);
	test.deepEqual(scatterPlot.debug(), true);

	test.end()
});
