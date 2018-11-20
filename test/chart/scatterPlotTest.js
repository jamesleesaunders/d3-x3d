let test = require('tape');
let d3X3dom = require("../../");

test("Test Scatter Plot base, scatterPlot()", function(t) {
	let scatterPlot = d3X3dom.chart.scatterPlot();

	// Test Getter/ Setter functions for width
	t.deepEqual(scatterPlot.width(), 500, "Default width should be 500");
	scatterPlot.width(300);
	t.deepEqual(scatterPlot.width(), 300);

	// Test Getter/ Setter functions for height
	t.deepEqual(scatterPlot.height(), 500, "Default height should be 500");
	scatterPlot.height(300);
	t.deepEqual(scatterPlot.height(), 300);

	// Test for Getter and setter function for dimensions
	t.deepEqual(scatterPlot.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	scatterPlot.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(scatterPlot.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	t.deepEqual(scatterPlot.xScale(), undefined, "xScale is undefined");
	scatterPlot.xScale(0.2);
	t.deepEqual(scatterPlot.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	t.deepEqual(scatterPlot.yScale(), undefined, "yScale is undefined");
	scatterPlot.yScale(0.1);
	t.deepEqual(scatterPlot.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	t.deepEqual(scatterPlot.zScale(), undefined, "zScale is undefined");
	scatterPlot.zScale(0.1);
	t.deepEqual(scatterPlot.zScale(), 0.1, "zScale changed");

	// Test for Getter and setter function for color
	t.deepEqual(scatterPlot.color(), "orange", "Default color is orange");
	scatterPlot.color("red");
	t.deepEqual(scatterPlot.color(), "red");

	// Test for Getter and Setter function for debug
	t.deepEqual(scatterPlot.debug(), false, "Show debug log and stats is set to false");
	scatterPlot.debug(true);
	t.deepEqual(scatterPlot.debug(), true);

	t.end()
});
