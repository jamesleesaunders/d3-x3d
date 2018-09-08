let d3X3d = require("../");
let tape = require("tape");
let d3 = require("d3");

tape("Test Axis Component", function(test) {
	let axis = d3X3d.component.axis();

	test.equal(axis.width(), 40.0, "Returns default width");
	test.equal(axis.tickFormat(), null, "Returns default tick format");
	test.equal(axis.color(), "black", "Returns default color");

	test.end();
});
