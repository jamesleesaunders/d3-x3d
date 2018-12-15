let test = require('tape');
let d3X3dom = require("../../");

test("Test Scatter Plot Chart, chart.scatterPlot()", function(t) {
	let scatterPlot = d3X3dom.chart.scatterPlot();

	// Test Getter/ Setter functions for width
	t.deepEqual(scatterPlot.width(), 500, "Default width");
	scatterPlot.width(300);
	t.deepEqual(scatterPlot.width(), 300, "Changed width");

	// Test Getter/ Setter functions for height
	t.deepEqual(scatterPlot.height(), 500, "Default height");
	scatterPlot.height(300);
	t.deepEqual(scatterPlot.height(), 300, "Changed height");

	// Test for Getter and setter function for dimensions
	t.deepEqual(scatterPlot.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	scatterPlot.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(scatterPlot.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test for Getter and setter function for xScale
	t.deepEqual(scatterPlot.xScale(), undefined, "Default xScale is undefined");
	scatterPlot.xScale(0.2);
	t.deepEqual(scatterPlot.xScale(), 0.2, "Changed xScale set");

	// Test for Getter and setter function for yScale
	t.deepEqual(scatterPlot.yScale(), undefined, "Default yScale is undefined");
	scatterPlot.yScale(0.1);
	t.deepEqual(scatterPlot.yScale(), 0.1, "Changed yScale set");

	// Test for Getter and setter function for zScale
	t.deepEqual(scatterPlot.zScale(), undefined, "Default zScale is undefined");
	scatterPlot.zScale(0.1);
	t.deepEqual(scatterPlot.zScale(), 0.1, "Changed zScale set");

	// Test for Getter and setter function for color
	t.deepEqual(scatterPlot.color(), "orange", "Default color");
	scatterPlot.color("red");
	t.deepEqual(scatterPlot.color(), "red", "Changed color");

	// Test for Getter and Setter function for debug
	t.deepEqual(scatterPlot.debug(), false, "Debug mode is false");
	scatterPlot.debug(true);
	t.deepEqual(scatterPlot.debug(), true, "Debug mode is true");

	t.end();
});
