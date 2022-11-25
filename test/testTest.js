import test from "mocha";
import * as chai from "chai";
import d3X3d from "../index.js"

test.describe("Test Test", () => {
	console.log(d3X3d);
	test.it("should equal hello", (done) => {
		chai.expect('hello').to.equal("hello");
		done();
	});
});
