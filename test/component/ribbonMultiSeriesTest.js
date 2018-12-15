let test = require('tape');
let d3X3dom = require("../../");

test("Test Multi Series Ribbon Component, component.ribbon()", function(t) {
	let ribbonMultiSeries = d3X3dom.component.ribbonMultiSeries();

	// Test for Getter and setter function for dimensions
	t.deepEqual(ribbonMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	ribbonMultiSeries.dimensions({ x: 80, y: 40, z: 10 });
	t.deepEqual(ribbonMultiSeries.dimensions(), { x: 80, y: 40, z: 10 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	t.deepEqual(ribbonMultiSeries.xScale(), undefined, "xScale is undefined");
	ribbonMultiSeries.xScale(0.2);
	t.deepEqual(ribbonMultiSeries.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	t.deepEqual(ribbonMultiSeries.yScale(), undefined, "yScale is undefined");
	ribbonMultiSeries.yScale(0.1);
	t.deepEqual(ribbonMultiSeries.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	t.deepEqual(ribbonMultiSeries.zScale(), undefined, "zScale is undefined");
	ribbonMultiSeries.zScale(0.1);
	t.deepEqual(ribbonMultiSeries.zScale(), 0.1, "zScale changed");

	// Test for Getter and setter function for color Scale
	t.deepEqual(ribbonMultiSeries.colorScale(), undefined, "colorScale is undefined");
	ribbonMultiSeries.colorScale(2);
	t.deepEqual(ribbonMultiSeries.colorScale(), 2, "colorScale changed");

	// Test for Getter and setter function for colors
	t.deepEqual(ribbonMultiSeries.colors(), ["orange", "red", "yellow", "steelblue", "green"], "Returns default colors");
	ribbonMultiSeries.colors(["red", "blue", "orange", "cyna", "green"]);
	t.deepEqual(ribbonMultiSeries.colors(), ["red", "blue", "orange", "cyna", "green"], "Ribbon color changed");

	t.end();
});
