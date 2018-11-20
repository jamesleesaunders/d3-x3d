let d3X3dom = require("../../build/d3-x3dom");
let tape = require("tape");

tape("Test Ribbon Base, ribbon()", function(test) {
	let ribbon = d3X3dom.component.ribbon();

	// Test for Getter and setter function for dimensions
	test.deepEqual(ribbon.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	ribbon.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(ribbon.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(ribbon.xScale(), undefined, "xScale is undefined");
	ribbon.xScale(0.2);
	test.deepEqual(ribbon.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(ribbon.yScale(), undefined, "yScale is undefined");
	ribbon.yScale(0.1);
	test.deepEqual(ribbon.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for color
	test.deepEqual(ribbon.color(), "red", "Default color is red");
	ribbon.color("steelblue");
	test.deepEqual(ribbon.color(), "steelblue", "Default color changed to steelblue");

	test.end()
});
