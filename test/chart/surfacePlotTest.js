const tape = require('tape');
let d3X3dom = require("../../build/d3-x3dom");

tape("Test Surface Plot, surfacePlot()", function(test) {
	let surfacePlot = d3X3dom.chart.surfacePlot();

	// Test Getter/ Setter functions for width
	test.deepEqual(surfacePlot.width(), 500, "Default width should be 500");
	surfacePlot.width(300);
	test.deepEqual(surfacePlot.width(), 300);

	// Test Getter/ Setter functions for height
	test.deepEqual(surfacePlot.height(), 500, "Default height should be 500");
	surfacePlot.height(300);
	test.deepEqual(surfacePlot.height(), 300);

	// Test for Getter and setter function for dimensions
	test.deepEqual(surfacePlot.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	surfacePlot.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(surfacePlot.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(surfacePlot.xScale(), undefined, "xScale is undefined");
	surfacePlot.xScale(0.2);
	test.deepEqual(surfacePlot.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(surfacePlot.yScale(), undefined, "yScale is undefined");
	surfacePlot.yScale(0.1);
	test.deepEqual(surfacePlot.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(surfacePlot.zScale(), undefined, "zScale is undefined");
	surfacePlot.zScale(0.1);
	test.deepEqual(surfacePlot.zScale(), 0.1, "zScale changed");

	// Test for Getter and Setter function for debug
	test.deepEqual(surfacePlot.debug(), false, "Show debug log and stats is set to false");
	surfacePlot.debug(true);
	test.deepEqual(surfacePlot.debug(), true);

	// Test Getter/ Setter functions for colors
	test.deepEqual(surfacePlot.colors(), ["blue", "red"], 'Default colors should be ["blue", "red"]');
	surfacePlot.colors(["orange", "yellow"]);
	test.deepEqual(surfacePlot.colors(), ["orange", "yellow"]);

	// Test for Getter and setter function for color Scale
	test.deepEqual(surfacePlot.colorScale(), undefined, "colorScale is undefined");
	surfacePlot.colorScale(2);
	test.deepEqual(surfacePlot.colorScale(), 2, "colorScale changed");

	test.end()
});
