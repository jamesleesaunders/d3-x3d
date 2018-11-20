let d3X3dom = require("../../build/d3-x3dom");
let tape = require("tape");

tape("Test Axis Component Default Values, axis()", function(test) {
	let axis = d3X3dom.component.axis();

	// Test for Getter and setter function for color
	test.equal(axis.color(), "black", "Returns default color, black");
	axis.color("red");
	test.deepEqual(axis.color(), "red", "Axis color changed");

	// Test for Getter and setter function for dimensions
	test.deepEqual(axis.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	axis.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(axis.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for tickValues
	test.deepEqual(axis.tickValues(), null, "Test tickValues() Empty");
	axis.tickValues(["Apples", "Oranges", "Pears", "Kiwis"]);
	test.deepEqual(axis.tickValues(), ["Apples", "Oranges", "Pears", "Kiwis"], "Test tickValues() Populated");

	// Test for Getter and setter function for tick direction
	test.deepEqual(axis.tickDir(), undefined, "tickDir() is empty");
	axis.tickDir("x");
	test.deepEqual(axis.tickDir(), "x", "tickDir() is x");

	// Test for Getter and setter function for tick arguments
	test.deepEqual(axis.tickArguments(), [], "tickArguments() is empty");
	axis.tickArguments([10, 20, 30, 40, 50]);
	test.deepEqual(axis.tickArguments(), [10, 20, 30, 40, 50], "tickArguments() is populated");

	// Test for Getter and setter function for tick format
	test.deepEqual(axis.tickFormat(), null, "tickFormat() is empty");
	axis.tickFormat('');
	test.deepEqual(axis.tickFormat(), '', "tickFormat() is populated");

	// Test for Getter and setter function for tick size
	test.deepEqual(axis.tickSize(), 1, "default tick size is 1");
	axis.tickSize(5);
	test.deepEqual(axis.tickSize(), 5, "tickSize() is populated");

	// Test for Getter and setter function for tick padding
	test.deepEqual(axis.tickPadding(), 1, "default tick padding is 1");
	axis.tickPadding(5);
	test.deepEqual(axis.tickPadding(), 5, "tickPadding() is populated");

	// Test for Getter and setter function for direction
	test.deepEqual(axis.dir(), undefined, "direction is undefined");
	axis.dir('z');
	test.deepEqual(axis.dir(), 'z', "direction is set");

	// Test for Getter and setter function for scale
	test.deepEqual(axis.scale(), undefined, "scale is undefined");
	axis.scale(5);
	test.deepEqual(axis.scale(), 5, "scale is set");

	test.end();
});
