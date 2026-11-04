import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Light Component, component.light()", function() {
	let light = d3X3d.component.light();

	// Test direction getter / setter function
	test.describe("#direction()", function() {
		test.it("Default direction", function(done) {
			chai.expect(light.direction()).to.equal("1 0 -1");
			done();
		});
		test.it("Changed direction", function(done) {
			light.direction("0 1 0");
			chai.expect(light.direction()).to.equal("0 1 0");
			done();
		});
	});

	// Test intensity getter / setter function
	test.describe("#intensity()", function() {
		test.it("Default intensity", function(done) {
			chai.expect(light.intensity()).to.equal(0.5);
			done();
		});
		test.it("Changed intensity", function(done) {
			light.intensity(1);
			chai.expect(light.intensity()).to.equal(1);
			done();
		});
	});

	// Test shadowIntensity getter / setter function
	test.describe("#shadowIntensity()", function() {
		test.it("Default shadowIntensity", function(done) {
			chai.expect(light.shadowIntensity()).to.equal(0);
			done();
		});
		test.it("Changed shadowIntensity", function(done) {
			light.shadowIntensity(0.4);
			chai.expect(light.shadowIntensity()).to.equal(0.4);
			done();
		});
	});
});
