let test = require('tape');
let d3X3dom = require("../../");

test("Test Axis Component, component.axis()", function(t) {
	let axis = d3X3dom.component.axis();

	// Test for Getter and setter function for color
	t.equal(axis.color(), "black", "Returns default color, black");
	axis.color("red");
	t.deepEqual(axis.color(), "red", "Axis color changed");

	// Test for Getter and setter function for dimensions
	t.deepEqual(axis.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	axis.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(axis.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for tickValues
	t.deepEqual(axis.tickValues(), null, "Test tickValues() Empty");
	axis.tickValues(["Apples", "Oranges", "Pears", "Bananas"]);
	t.deepEqual(axis.tickValues(), ["Apples", "Oranges", "Pears", "Bananas"], "Test tickValues() Populated");

	// Test for Getter and setter function for tick direction
	t.deepEqual(axis.tickDir(), undefined, "tickDir() is empty");
	axis.tickDir("x");
	t.deepEqual(axis.tickDir(), "x", "tickDir() is x");

	// Test for Getter and setter function for tick arguments
	t.deepEqual(axis.tickArguments(), [], "tickArguments() is empty");
	axis.tickArguments([10, 20, 30, 40, 50]);
	t.deepEqual(axis.tickArguments(), [10, 20, 30, 40, 50], "tickArguments() is populated");

	// Test for Getter and setter function for tick format
	t.deepEqual(axis.tickFormat(), null, "tickFormat() is empty");
	axis.tickFormat('');
	t.deepEqual(axis.tickFormat(), '', "tickFormat() is populated");

	// Test for Getter and setter function for tick size
	t.deepEqual(axis.tickSize(), 1, "default tick size is 1");
	axis.tickSize(5);
	t.deepEqual(axis.tickSize(), 5, "tickSize() is populated");

	// Test for Getter and setter function for tick padding
	t.deepEqual(axis.tickPadding(), 1, "default tick padding is 1");
	axis.tickPadding(5);
	t.deepEqual(axis.tickPadding(), 5, "tickPadding() is populated");

	// Test for Getter and setter function for direction
	t.deepEqual(axis.dir(), undefined, "direction is undefined");
	axis.dir('z');
	t.deepEqual(axis.dir(), 'z', "direction is set");

	// Test for Getter and setter function for scale
	t.deepEqual(axis.scale(), undefined, "scale is undefined");
	axis.scale(5);
	t.deepEqual(axis.scale(), 5, "scale is set");

	t.end();
});
