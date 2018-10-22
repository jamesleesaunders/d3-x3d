let d3X3dom = require("../");
let tape = require("tape");

tape("Test Index", function(t) {
	t.equal(d3X3dom.author, "James Saunders", "Returns author");
	t.equal(d3X3dom.license, "GPL-2.0", "Returns license");
	t.equal(d3X3dom.copyright, "Copyright (C) 2018 James Saunders", "Returns copyright");

	t.end();
});
