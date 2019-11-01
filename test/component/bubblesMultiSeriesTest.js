let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Multi Series Bubbles Component, component.bubbleMultiSeries()", function(t) {
	let bubblesMultiSeries = d3X3d.component.bubblesMultiSeries();

	// Test dimensions getter / setter function
	t.deepEqual(bubblesMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	bubblesMultiSeries.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(bubblesMultiSeries.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(bubblesMultiSeries.xScale(), undefined, "Default xScale is undefined");
	bubblesMultiSeries.xScale(0.2);
	t.equal(bubblesMultiSeries.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(bubblesMultiSeries.yScale(), undefined, "Default yScale is undefined");
	bubblesMultiSeries.yScale(0.1);
	t.equal(bubblesMultiSeries.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(bubblesMultiSeries.zScale(), undefined, "Default zScale is undefined");
	bubblesMultiSeries.zScale(0.2);
	t.equal(bubblesMultiSeries.zScale(), 0.2, "Changed zScale is set");

	// Test sizeScale getter / setter function
	t.equal(bubblesMultiSeries.sizeScale(), undefined, "Default sizeScale is undefined");
	bubblesMultiSeries.sizeScale(2);
	t.equal(bubblesMultiSeries.sizeScale(), 2, "Changed sizeScale is set");

	// Test colorScale getter / setter function
	t.equal(bubblesMultiSeries.colorScale(), undefined, "Default colorScale is undefined");
	bubblesMultiSeries.colorScale(0.2);
	t.equal(bubblesMultiSeries.colorScale(), 0.2, "Changed colorScale is set");

	// Test sizeRange getter / setter function
	t.deepEqual(bubblesMultiSeries.sizeRange(), [0.5, 3.0], "Default sizeRange");
	bubblesMultiSeries.sizeRange([0.2, 5.0]);
	t.deepEqual(bubblesMultiSeries.sizeRange(), [0.2, 5.0], "Changed sizeRange");

	// Test colors getter / setter function
	t.deepEqual(bubblesMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	bubblesMultiSeries.colors(["steelblue", "green", "red", "yellow", "orange"]);
	t.deepEqual(bubblesMultiSeries.colors(), ["steelblue", "green", "red", "yellow", "orange"], "Changed colors");

	t.end();
});
