let test = require('tape');
let window = require('browser-env')();
let d3X3dom = require("../../");

test("Test Multi Series Ribbon Component, component.ribbon()", function(t) {
	let ribbonMultiSeries = d3X3dom.component.ribbonMultiSeries();

	// Test dimensions getter / setter function
	t.deepEqual(ribbonMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	ribbonMultiSeries.dimensions({ x: 80, y: 40, z: 10 });
	t.deepEqual(ribbonMultiSeries.dimensions(), { x: 80, y: 40, z: 10 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.deepEqual(ribbonMultiSeries.xScale(), undefined, "Default xScale is undefined");
	ribbonMultiSeries.xScale(0.2);
	t.deepEqual(ribbonMultiSeries.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.deepEqual(ribbonMultiSeries.yScale(), undefined, "Default yScale is undefined");
	ribbonMultiSeries.yScale(0.1);
	t.deepEqual(ribbonMultiSeries.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.deepEqual(ribbonMultiSeries.zScale(), undefined, "Default zScale is undefined");
	ribbonMultiSeries.zScale(0.1);
	t.deepEqual(ribbonMultiSeries.zScale(), 0.1, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.deepEqual(ribbonMultiSeries.colorScale(), undefined, "Default colorScale is undefined");
	ribbonMultiSeries.colorScale(2);
	t.deepEqual(ribbonMultiSeries.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(ribbonMultiSeries.colors(), ["orange", "red", "yellow", "steelblue", "green"], "Default colors");
	ribbonMultiSeries.colors(["red", "blue", "orange", "cyna", "green"]);
	t.deepEqual(ribbonMultiSeries.colors(), ["red", "blue", "orange", "cyna", "green"], "Changed colors");

	t.end();
});
