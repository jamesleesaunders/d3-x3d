let test = require('tape');
let window = require('browser-env')();
let d3X3dom = require("../../");

test("Test Ribbon Component, component.ribbon()", function(t) {
	let ribbon = d3X3dom.component.ribbon();

	// Test dimensions getter / setter function
	t.deepEqual(ribbon.dimensions(), { x: 40, y: 40, z: 5 }, "Default dimensions");
	ribbon.dimensions({ x: 80, y: 40, z: 10 });
	t.deepEqual(ribbon.dimensions(), { x: 80, y: 40, z: 10 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.deepEqual(ribbon.xScale(), undefined, "Default xScale is undefined");
	ribbon.xScale(0.2);
	t.deepEqual(ribbon.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.deepEqual(ribbon.yScale(), undefined, "Default yScale is undefined");
	ribbon.yScale(0.1);
	t.deepEqual(ribbon.yScale(), 0.1, "Changed yScale is set");

	// Test color getter / setter function
	t.deepEqual(ribbon.color(), "red", "Default color");
	ribbon.color("steelblue");
	t.deepEqual(ribbon.color(), "steelblue", "Changed color");

	t.end();
});
