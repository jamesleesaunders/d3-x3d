let d3Ez = require("../");
let tape = require("tape");
let jsdom = require("jsdom");

tape("setup", function(t) {
	let JSDOM = jsdom.JSDOM;
	global.document = new JSDOM().window.document;
	t.end();
});

tape("indexTest", function(t) {
	t.equal(d3Ez.author, "James Saunders", "Returns author");
	t.equal(d3Ez.license, "GPL-2.0", "Returns license");

	t.end();
});
