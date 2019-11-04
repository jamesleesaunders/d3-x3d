let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Vector Fields Component, component.vectorFields()", function(t) {
	let vectorFields = d3X3d.component.vectorFields();

	// Test dimensions getter / setter function
	t.deepEqual(vectorFields.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	vectorFields.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(vectorFields.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(vectorFields.xScale(), undefined, "Default xScale is undefined");
	vectorFields.xScale(0.2);
	t.equal(vectorFields.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(vectorFields.yScale(), undefined, "Default yScale is undefined");
	vectorFields.yScale(0.1);
	t.equal(vectorFields.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(vectorFields.zScale(), undefined, "Default zScale is undefined");
	vectorFields.zScale(0.2);
	t.equal(vectorFields.zScale(), 0.2, "Changed zScale is set");

	// Test sizeScale getter / setter function
	t.equal(vectorFields.sizeScale(), undefined, "Default sizeScale is undefined");
	vectorFields.sizeScale(2);
	t.equal(vectorFields.sizeScale(), 2, "Changed sizeScale is set");

	// Test sizeRange getter / setter function
	t.deepEqual(vectorFields.sizeRange(), [2.0, 5.0], "Default sizeRange");
	vectorFields.sizeRange([3.5, 7.0]);
	t.deepEqual(vectorFields.sizeRange(), [3.5, 7.0], "Changed sizeRange");

	// Test colorScale getter / setter function
	t.equal(vectorFields.colorScale(), undefined, "Default colorScale is undefined");
	vectorFields.colorScale(2);
	t.equal(vectorFields.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(vectorFields.colors(), ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"], "Default colors");
	vectorFields.colors(d3.schemePurples[4]);
	t.deepEqual(vectorFields.colors(), ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"], "Changed colors");

	// Test vectorFunction getter / setter function
	t.equal(typeof vectorFields.vectorFunction(), "function", "Default vectorFunction");
	vectorFields.vectorFunction(() => "Hello World");
	t.equal(vectorFields.vectorFunction()(), "Hello World", "Changed vectorFunction");

	t.end();
});
