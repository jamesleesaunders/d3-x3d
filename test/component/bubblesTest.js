let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Bubbles Component, component.bubbles()", function(t) {
	let bubbles = d3X3d.component.bubbles();

	// Test dimensions getter / setter function
	t.deepEqual(bubbles.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	bubbles.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(bubbles.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(bubbles.xScale(), undefined, "Default xScale is undefined");
	bubbles.xScale(0.2);
	t.equal(bubbles.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(bubbles.yScale(), undefined, "Default yScale is undefined");
	bubbles.yScale(0.1);
	t.equal(bubbles.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(bubbles.zScale(), undefined, "Default zScale is undefined");
	bubbles.zScale(0.2);
	t.equal(bubbles.zScale(), 0.2, "Changed zScale is set");

	// Test sizeScale getter / setter function
	t.equal(bubbles.sizeScale(), undefined, "Default sizeScale is undefined");
	bubbles.sizeScale(2);
	t.equal(bubbles.sizeScale(), 2, "Changed sizeScale is set");

	// Test sizeRange getter / setter function
	t.deepEqual(bubbles.sizeRange(), [0.2, 4.0], "Default sizeRange");
	bubbles.sizeRange([0.5, 5.0]);
	t.deepEqual(bubbles.sizeRange(), [0.5, 5.0], "Changed sizeRange");

	// Test color getter / setter function
	t.equal(bubbles.color(), undefined, "Default color");
	bubbles.color("yellow");
	t.equal(bubbles.color(), "yellow", "Changed color");

	// Test colors getter / setter function
	t.deepEqual(bubbles.colors(), ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"], "Default colors");
	bubbles.colors(["red", "green"]);
	t.deepEqual(bubbles.colors(), ["red", "green"], "Changed colors");

	t.end();
});
