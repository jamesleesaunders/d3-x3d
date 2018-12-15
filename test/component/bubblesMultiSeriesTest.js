let test = require('tape');
let d3X3dom = require("../../");

test("Test Multi Series Bubbles Component, component.bubbleMultiSeries()", function(t) {
	let bubblesMultiSeries = d3X3dom.component.bubblesMultiSeries();

	// Test for Getter and setter function for dimensions
	t.deepEqual(bubblesMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	bubblesMultiSeries.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(bubblesMultiSeries.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	t.deepEqual(bubblesMultiSeries.xScale(), undefined, "xScale is undefined");
	bubblesMultiSeries.xScale(0.2);
	t.deepEqual(bubblesMultiSeries.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	t.deepEqual(bubblesMultiSeries.yScale(), undefined, "yScale is undefined");
	bubblesMultiSeries.yScale(0.1);
	t.deepEqual(bubblesMultiSeries.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	t.deepEqual(bubblesMultiSeries.zScale(), undefined, "zScale is undefined");
	bubblesMultiSeries.zScale(0.2);
	t.deepEqual(bubblesMultiSeries.zScale(), 0.2, "zScale changed");

	// Test for Getter and setter function for size Scale
	t.deepEqual(bubblesMultiSeries.sizeScale(), undefined, "size scale is undefined");
	bubblesMultiSeries.sizeScale(2);
	t.deepEqual(bubblesMultiSeries.sizeScale(), 2, "size scale changed");

	// Test for Getter and setter function for size domain
	t.deepEqual(bubblesMultiSeries.sizeDomain(), [0.5, 3.0], "size domain default is [0.5, 3.0]");
	bubblesMultiSeries.sizeDomain([0.2, 5.0]);
	t.deepEqual(bubblesMultiSeries.sizeDomain(), [0.2, 5.0], "size domain changed");

	// Test for Getter and setter function for color scale
	t.deepEqual(bubblesMultiSeries.colorScale(), undefined, "Returns default color scale");
	bubblesMultiSeries.colorScale(0.2);
	t.deepEqual(bubblesMultiSeries.colorScale(), 0.2, "Axis color scale changed");

	// Test for Getter and setter function for colors
	t.deepEqual(bubblesMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Returns default colors");
	bubblesMultiSeries.colors(["steelblue", "green", "red", "yellow", "orange"]);
	t.deepEqual(bubblesMultiSeries.colors(), ["steelblue", "green", "red", "yellow", "orange"], "Bubbles color changed");

	t.end();
});
