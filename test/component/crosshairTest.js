let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Crosshair Component, component.crosshair()", function(t) {
	let crosshair = d3X3d.component.crosshair();

	// Test dimensions getter / setter function
	t.deepEqual(crosshair.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	crosshair.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(crosshair.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(crosshair.xScale(), undefined, "Default xScale is undefined");
	crosshair.xScale(5);
	t.equal(crosshair.xScale(), 5, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(crosshair.yScale(), undefined, "Default yScale is undefined");
	crosshair.yScale(5);
	t.equal(crosshair.yScale(), 5, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(crosshair.zScale(), undefined, "Default zScale is undefined");
	crosshair.zScale(5);
	t.equal(crosshair.zScale(), 5, "Changed zScale is set");

	// Test colors getter / setter function
	t.deepEqual(crosshair.colors(), ["blue", "red", "green"], "Default colors");
	crosshair.colors(["orange", "cyan", "magenta"]);
	t.deepEqual(crosshair.colors(), ["orange", "cyan", "magenta"], "Changed colors");

	t.end();
});
