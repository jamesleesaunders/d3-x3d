let d3X3dom = require("../");
let tape = require("tape");

tape("Test Axis Component Base", function(test) {
	let axis = d3X3dom.component.axis();

	test.deepEqual(axis.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	test.equal(axis.tickFormat(), null, "Returns default tick format");
	test.equal(axis.color(), "black", "Returns default color");

	test.end();
});

tape("Test Axis Component Tick Values", function(test) {
	let axis = d3X3dom.component.axis();

	test.deepEqual(axis.tickValues(), null, "Test tickValues() Empty");

	axis.tickValues(["Apples", "Oranges", "Pears", "Kiwis"]);
	test.deepEqual(axis.tickValues(), ["Apples", "Oranges", "Pears", "Kiwis"], "Test tickValues() Populated");

	test.end();
});
