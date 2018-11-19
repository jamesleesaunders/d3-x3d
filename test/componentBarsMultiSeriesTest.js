let d3X3dom = require("../");
let tape = require("tape");

tape("Test Bars MultiSeries Component Base, barMultiSeries()", function(test) {
	let barsMultiSeries = d3X3dom.component.barsMultiSeries();

	// Test for Getter and setter function for dimensions
	test.deepEqual(barsMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	barsMultiSeries.dimensions({ x: 20, y: 20, z: 10 });
	test.deepEqual(barsMultiSeries.dimensions(), { x: 20, y: 20, z: 10 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(barsMultiSeries.xScale(), undefined, "xScale is undefined");
	barsMultiSeries.xScale(0.2);
	test.deepEqual(barsMultiSeries.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(barsMultiSeries.yScale(), undefined, "yScale is undefined");
	barsMultiSeries.yScale(0.1);
	test.deepEqual(barsMultiSeries.yScale(), 0.1, "yScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(barsMultiSeries.zScale(), undefined, "zScale is undefined");
	barsMultiSeries.zScale(0.1);
	test.deepEqual(barsMultiSeries.zScale(), 0.1, "zScale changed");

	// Test for Getter and setter function for color Scale
	test.deepEqual(barsMultiSeries.colorScale(), undefined, "colorScale is undefined");
	barsMultiSeries.colorScale(2);
	test.deepEqual(barsMultiSeries.colorScale(), 2, "colorScale changed");

	// Test for Getter and setter function for colors
	test.deepEqual(barsMultiSeries.colors(), ["orange", "red", "yellow", "steelblue", "green"], "Returns default colors");
	barsMultiSeries.colors(["red", "blue", "orange", "cyna", "green"]);
	test.deepEqual(barsMultiSeries.colors(), ["red", "blue", "orange", "cyna", "green"], "Bar color changed");

	test.end();
});
