let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3dom = require("../../");

test("Test Axis Component, component.axis()", function(t) {
	let axis = d3X3dom.component.axis();

	// Test dimensions getter / setter function
	t.deepEqual(axis.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	axis.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(axis.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test scale getter / setter function
	t.deepEqual(axis.scale(), undefined, "Default scale is undefined");
	axis.scale(5);
	t.deepEqual(axis.scale(), 5, "Changed scale is set");

	// Test color getter / setter function
	t.equal(axis.color(), "black", "Default color");
	axis.color("red");
	t.deepEqual(axis.color(), "red", "Changed color");

	// Test direction getter / setter function
	t.deepEqual(axis.direction(), undefined, "Default direction is undefined");
	axis.direction('z');
	t.deepEqual(axis.direction(), 'z', "Changed direction is set");

	// Test tickDirection getter / setter function
	t.deepEqual(axis.tickDirection(), undefined, "Default tickDirection is undefined");
	axis.tickDirection("x");
	t.deepEqual(axis.tickDirection(), "x", "Changed tickDirection is set");

	// Test tickValues getter / setter function
	t.deepEqual(axis.tickValues(), null, "Default tickValues is null");
	axis.tickValues(["Apples", "Oranges", "Pears", "Bananas"]);
	t.deepEqual(axis.tickValues(), ["Apples", "Oranges", "Pears", "Bananas"], "Changed tickValues is set");

	// Test tickArguments getter / setter function
	t.deepEqual(axis.tickArguments(), [], "Default tickArguments is undefined");
	axis.tickArguments([10, 20, 30, 40, 50]);
	t.deepEqual(axis.tickArguments(), [10, 20, 30, 40, 50], "Changed tickArguments is set");

	// Test tickFormat getter / setter function
	t.deepEqual(axis.tickFormat(), null, "Default tickArguments is null");
	axis.tickFormat('');
	t.deepEqual(axis.tickFormat(), '', "Changd tickFormat is set");

	// Test tickSize getter / setter function
	t.deepEqual(axis.tickSize(), 1, "Default tickSize");
	axis.tickSize(5);
	t.deepEqual(axis.tickSize(), 5, "Changed tickSize is set");

	// Test tickPadding getter / setter function
	t.deepEqual(axis.tickPadding(), 1.5, "Default tickPadding");
	axis.tickPadding(5);
	t.deepEqual(axis.tickPadding(), 5, "Changed tickPadding is set");

	t.end();
});
