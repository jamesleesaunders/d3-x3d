let d3X3dom = require("../../build/d3-x3dom");
let tape = require("tape");

tape("Test Bubbles Component Base, bubbles()", function(test) {
	let bubbles = d3X3dom.component.bubbles();

	// Test for Getter and setter function for dimensions
	test.deepEqual(bubbles.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	bubbles.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(bubbles.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(bubbles.xScale(), undefined, "xScale is undefined");
	bubbles.xScale(0.2);
	test.deepEqual(bubbles.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(bubbles.yScale(), undefined, "yScale is undefined");
	bubbles.yScale(0.1);
	test.deepEqual(bubbles.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(bubbles.zScale(), undefined, "zScale is undefined");
	bubbles.zScale(0.2);
	test.deepEqual(bubbles.zScale(), 0.2, "zScale changed");

	// Test for Getter and setter function for size Scale
	test.deepEqual(bubbles.sizeScale(), undefined, "size scale is undefined");
	bubbles.sizeScale(2);
	test.deepEqual(bubbles.sizeScale(), 2, "size scale changed");

	// Test for Getter and setter function for size domain
	test.deepEqual(bubbles.sizeDomain(), [0.5, 4.0], "size domain default is [0.5, 4.0]");
	bubbles.sizeDomain([0.2, 5.0]);
	test.deepEqual(bubbles.sizeDomain(), [0.2, 5.0], "size domain changed");

	// Test for Getter and setter function for color
	test.deepEqual(bubbles.color(), "orange", "Returns default color");
	bubbles.color("yellow");
	test.deepEqual(bubbles.color(), "yellow", "Bubbles color changed");

	test.end()
});
