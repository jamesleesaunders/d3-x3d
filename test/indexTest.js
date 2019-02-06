let test = require('tape');
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require("../");

test("Test Index", function(t) {
	let author = "James Saunders";
	let license = "GPL-2.0";
	let year = new Date().getFullYear();

	t.equal(d3X3dom.author, author, "Returns author");
	t.equal(d3X3dom.license, license, "Returns license");
	t.equal(d3X3dom.copyright, `Copyright (C) ${year} ${author}`, "Returns copyright");

	t.equal(typeof d3X3dom.chart === 'object', true, "Returns chart object");
	t.equal(typeof d3X3dom.component === 'object', true, "Returns component object");

	t.end();
});
