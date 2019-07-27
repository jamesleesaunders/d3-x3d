let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Bars Component, component.bars()", function(t) {
	let bars = d3X3d.component.bars();

	// Test dimensions getter / setter function
	t.deepEqual(bars.dimensions(), { x: 40, y: 40, z: 2 }, "Default dimensions");
	bars.dimensions({ x: 20, y: 20, z: 1 });
	t.deepEqual(bars.dimensions(), { x: 20, y: 20, z: 1 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(bars.xScale(), undefined, "Default xScale is undefined");
	bars.xScale(0.2);
	t.equal(bars.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(bars.yScale(), undefined, "Default yScale is undefined");
	bars.yScale(0.1);
	t.equal(bars.yScale(), 0.1, "Changed yScale is set");

	// Test colorScale getter / setter function
	t.equal(bars.colorScale(), undefined, "Default colorScale is undefined");
	bars.colorScale(2);
	t.equal(bars.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(bars.colors(), ["orange", "red", "yellow", "steelblue", "green"], "Default colors");
	bars.colors(["red", "blue", "orange", "cyan", "green"]);
	t.deepEqual(bars.colors(), ["red", "blue", "orange", "cyan", "green"], "Changed colors");

	t.end();
});
