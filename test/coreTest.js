let d3X3dom = require("../");
let tape = require("tape");

tape("Test Index", function(t) {
	let author = "James Saunders";
	let license = "GPL-2.0";
	let year = new Date().getFullYear();

	t.equal(d3X3dom.author, author, "Returns author");
	t.equal(d3X3dom.license, license, "Returns license");
	t.equal(d3X3dom.copyright, `Copyright (C) ${year} ${author}`, "Returns copyright");

	t.end();
});
