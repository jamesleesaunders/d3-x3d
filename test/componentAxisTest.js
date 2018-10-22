let d3X3dom = require("../");
let tape = require("tape");

tape("Test Axis Component", function(test) {
	let axis = d3X3dom.component.axis();

	test.deepEqual(axis.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	test.equal(axis.tickFormat(), null, "Returns default tick format");
	test.equal(axis.color(), "black", "Returns default color");

	test.end();
});
