import test from "mocha";
import * as chai from "chai";
import d3X3d from "../index.js"

test.describe("Test Index", function() {
	let author = "James Saunders";
	let license = "GPL-2.0";
	let year = new Date().getFullYear();

	test.it("Returns author", function(done) {
		chai.expect(d3X3d.author).to.equal(author);
		done();
	});

	test.it("Returns license", function(done) {
		chai.expect(d3X3d.license).to.equal(license);
		done();
	});

	test.it("Returns copyright", function(done) {
		chai.expect(d3X3d.copyright).to.equal(`Copyright (C) ${year} ${author}`);
		done();
	});

	test.it("Returns chart object", function(done) {
		chai.expect(d3X3d.chart).to.be.an("object");
		done();
	});

	test.it("Returns component object", function(done) {
		chai.expect(d3X3d.component).to.be.an("object");
		done();
	});
});
