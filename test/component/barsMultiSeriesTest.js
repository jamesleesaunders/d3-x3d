import test from "tape";
import d3X3d from "../../index.js"

test("Test Multi Series Bars Component, component.barMultiSeries()", function(t) {
	let barsMultiSeries = d3X3d.component.barsMultiSeries();

	// Test dimensions getter / setter function
	t.deepEqual(barsMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	barsMultiSeries.dimensions({ x: 20, y: 20, z: 10 });
	t.deepEqual(barsMultiSeries.dimensions(), { x: 20, y: 20, z: 10 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(barsMultiSeries.xScale(), undefined, "Default xScale is undefined");
	barsMultiSeries.xScale(0.2);
	t.equal(barsMultiSeries.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(barsMultiSeries.yScale(), undefined, "Default yScale is undefined");
	barsMultiSeries.yScale(0.1);
	t.equal(barsMultiSeries.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(barsMultiSeries.zScale(), undefined, "Default zScale is undefined");
	barsMultiSeries.zScale(0.1);
	t.equal(barsMultiSeries.zScale(), 0.1, "Changed xScale is set");

	// Test colorScale getter / setter function
	t.equal(barsMultiSeries.colorScale(), undefined, "Default colorScale is undefined");
	barsMultiSeries.colorScale(2);
	t.equal(barsMultiSeries.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(barsMultiSeries.colors(), ["orange", "red", "yellow", "steelblue", "green"], "Default colors");
	barsMultiSeries.colors(["red", "blue", "orange", "cyna", "green"]);
	t.deepEqual(barsMultiSeries.colors(), ["red", "blue", "orange", "cyna", "green"], "Changed colors");

	t.end();
});
