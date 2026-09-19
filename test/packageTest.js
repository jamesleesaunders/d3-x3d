import test from "mocha";
import * as chai from "chai";
import { readFileSync } from "node:fs";
import d3X3d from "d3-x3d";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test.describe("Test package exports", function() {
	test.it("resolves to the ESM distribution without JSON import attributes", function() {
		chai.expect(d3X3d.version).to.equal(packageJson.version);
		chai.expect(d3X3d.license).to.equal(packageJson.license);
	});
});
