let test = require('tape');
let window = require('browser-env')();
let d3X3dom = require("../../");

test("Test Three Plane Axis Component, component.axisThreePlane()", function(t) {
	let axisThreePlane = d3X3dom.component.axisThreePlane();

	// Test dimensions getter / setter function
	t.deepEqual(axisThreePlane.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	axisThreePlane.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(axisThreePlane.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.deepEqual(axisThreePlane.xScale(), undefined, "Default xScale is undefined");
	axisThreePlane.xScale(0.2);
	t.deepEqual(axisThreePlane.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.deepEqual(axisThreePlane.yScale(), undefined, "Default yScale is undefined");
	axisThreePlane.yScale(0.1);
	t.deepEqual(axisThreePlane.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.deepEqual(axisThreePlane.zScale(), undefined, "Default zScale is undefined");
	axisThreePlane.zScale(0.2);
	t.deepEqual(axisThreePlane.zScale(), 0.2, "Changed zScale is set");

	// Test colors getter / setter function
	t.deepEqual(axisThreePlane.colors(), ["blue", "red", "green"], "Default colors");
	axisThreePlane.colors(["yellow", "blue", "green"]);
	t.deepEqual(axisThreePlane.colors(), ["yellow", "blue", "green"], "Changed colors");

	t.end();
});
