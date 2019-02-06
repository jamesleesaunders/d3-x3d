let test = require('tape');
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require("../../");

test("Test Surface Area Component, component.surface()", function(t) {
	let surfaceArea = d3X3dom.component.surface();

	// Test dimensions getter / setter function
	t.deepEqual(surfaceArea.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	surfaceArea.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(surfaceArea.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(surfaceArea.xScale(), undefined, "Default xScale is undefined");
	surfaceArea.xScale(0.2);
	t.equal(surfaceArea.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(surfaceArea.yScale(), undefined, "Default yScale is undefined");
	surfaceArea.yScale(0.1);
	t.equal(surfaceArea.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(surfaceArea.zScale(), undefined, "Default zScale is undefined");
	surfaceArea.zScale(0.2);
	t.equal(surfaceArea.zScale(), 0.2, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.equal(surfaceArea.colorScale(), undefined, "Default colorScale is undefined");
	surfaceArea.colorScale(2);
	t.equal(surfaceArea.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(surfaceArea.colors(), ["blue", "red"], "Default colors");
	surfaceArea.colors(["orange", "green"]);
	t.deepEqual(surfaceArea.colors(), ["orange", "green"], "Changed colors");

	t.end();
});
