let d3X3dom = require("../../build/d3-x3dom");
let tape = require("tape");

tape("Test Bars Base, bars()", function(test) {
	let bars = d3X3dom.component.bars();

	// Test for Getter and setter function for dimensions
	test.deepEqual(bars.dimensions(), { x: 40, y: 40, z: 2 }, "Returns default dimensions");
	bars.dimensions({ x: 20, y: 20, z: 1 });
	test.deepEqual(bars.dimensions(), { x: 20, y: 20, z: 1 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(bars.xScale(), undefined, "xScale is undefined");
	bars.xScale(0.2);
	test.deepEqual(bars.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(bars.yScale(), undefined, "yScale is undefined");
	bars.yScale(0.1);
	test.deepEqual(bars.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for color Scale
	test.deepEqual(bars.colorScale(), undefined, "colorScale is undefined");
	bars.colorScale(2);
	test.deepEqual(bars.colorScale(), 2, "colorScale changed");

	// Test for Getter and setter function for colors
	test.deepEqual(bars.colors(), ["orange", "red", "yellow", "steelblue", "green"], "Returns default colors");
	bars.colors(["red", "blue", "orange", "cyna", "green"]);
	test.deepEqual(bars.colors(), ["red", "blue", "orange", "cyna", "green"], "Bars color changed");

	test.end();
});
