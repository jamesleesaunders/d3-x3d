let d3X3d = require("../");
let tape = require("tape");
let d3 = require("d3");

tape("x3dAxis", function(test) {
	var axis = d3X3d.component.axis();

	test.equal(axis.width(), 40.0);
	test.equal(axis.tickFormat(), null);
	test.equal(axis.tickSize(), 1);
	test.equal(axis.tickPadding(), 1);
	test.equal(axis.color(), "black");

	test.end();
});
