let d3X3dom = require("../");
let tape = require("tape");

tape("Test Surface Area Base, surface()", function(test) {
	let surfaceArea = d3X3dom.component.surface();

	// Test for Getter and setter function for dimensions
	test.deepEqual(surfaceArea.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	surfaceArea.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(surfaceArea.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(surfaceArea.xScale(), undefined, "xScale is undefined");
	surfaceArea.xScale(0.2);
	test.deepEqual(surfaceArea.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(surfaceArea.yScale(), undefined, "yScale is undefined");
	surfaceArea.yScale(0.1);
	test.deepEqual(surfaceArea.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(surfaceArea.zScale(), undefined, "zScale is undefined");
	surfaceArea.zScale(0.2);
	test.deepEqual(surfaceArea.zScale(), 0.2, "zScale changed");

	// Test for Getter and setter function for color Scale
	test.deepEqual(surfaceArea.colorScale(), undefined, "colorScale is undefined");
	surfaceArea.colorScale(2);
	test.deepEqual(surfaceArea.colorScale(), 2, "colorScale changed");

	// Test for Getter and setter function for colors
	test.deepEqual(surfaceArea.colors(), ["blue", "red"], "Returns default colors, blue & red");
	surfaceArea.colors(["orange", "green"]);
	test.deepEqual(surfaceArea.colors(), ["orange", "green"], "default color changed");

	test.end()
});
