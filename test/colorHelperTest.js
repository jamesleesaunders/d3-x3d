let test = require("mocha");
let chai = require("chai");
let d3X3d = require("../");

let colorHelper = d3X3d.colorHelper;

test.describe("Test CSS rgb() color parse", () => {
	test.it("Test 'rgb(0,0,0)'", (done) => {
		chai.expect(colorHelper.colorParse("rgb(0,0,0)")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});

	test.it("Test 'rgb(255, 255, 255)'", (done) => {
		chai.expect(colorHelper.colorParse("rgb(255, 255, 255)")).to.be.equal("1.0000 1.0000 1.0000");
		done();
	});

	test.it("Test 'rgb(255,255,255)'", (done) => {
		chai.expect(colorHelper.colorParse("rgb(255,255,255)")).to.be.equal("1.0000 1.0000 1.0000");
		done();
	});

	test.it("Test 'rgb(128, 128,0)'", (done) => {
		chai.expect(colorHelper.colorParse("rgb(128, 128,0)")).to.be.equal("0.5020 0.5020 0.0000");
		done();
	});
});


test.describe("Test hex color codes", () => {
	test.it("Test '#000000'", (done) => {
		chai.expect(colorHelper.colorParse("#000000")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});

	test.it("Test '#FFFFFF'", (done) => {
		chai.expect(colorHelper.colorParse("#FFFFFF")).to.be.equal("1.0000 1.0000 1.0000");
		done();
	});

	test.it("Test '#ccddee'", (done) => {
		chai.expect(colorHelper.colorParse("#cc44ee")).to.be.equal("0.8000 0.2667 0.9333");
		done();
	});

	test.it("Test '#000'", (done) => {
		chai.expect(colorHelper.colorParse("#000")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});

	test.it("Test '#fff'", (done) => {
		chai.expect(colorHelper.colorParse("#fff")).to.be.equal("1.0000 1.0000 1.0000");
		done();
	});

	test.it("Test '#222'", (done) => {
		chai.expect(colorHelper.colorParse("#222")).to.be.equal("0.1333 0.1333 0.1333");
		done();
	});
});

test.describe("Test CSS color names", () => {
	test.it("Test 'white'", (done) => {
		chai.expect(colorHelper.colorParse("white")).to.be.equal("1.0000 1.0000 1.0000");
		done();
	});

	test.it("Test 'steelblue'", (done) => {
		chai.expect(colorHelper.colorParse("steelblue")).to.be.equal("0.2745 0.5098 0.7059");
		done();
	});

	test.it("Test 'orange'", (done) => {
		chai.expect(colorHelper.colorParse("orange")).to.be.equal("1.0000 0.6471 0.0000");
		done();
	});
});

test.describe("Test X3D RGB colors", () => {
	test.it("Test '0 0 0'", (done) => {
		chai.expect(colorHelper.colorParse("0 0 0")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});

	test.it("Test '1 1 1'", (done) => {
		chai.expect(colorHelper.colorParse("1 1 1")).to.be.equal("1.0000 1.0000 1.0000");
		done();
	});

	test.it("Test '0.5 0.5 0.5'", (done) => {
		chai.expect(colorHelper.colorParse("0.5 0.5 0.5")).to.be.equal("0.5000 0.5000 0.5000");
		done();
	});

	test.it("Test '0.23 0.301 0'", (done) => {
		chai.expect(colorHelper.colorParse("0.23 0.301 0")).to.be.equal("0.2300 0.3010 0.0000");
		done();
	});
});

test.describe("Test some invalid inputs", () => {
	test.it("Test ''", (done) => {
		chai.expect(colorHelper.colorParse("")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});

	test.it("Test 'foo'", (done) => {
		chai.expect(colorHelper.colorParse("foo")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});

	test.it("Test ' '", (done) => {
		chai.expect(colorHelper.colorParse(" ")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});

	test.it("Test '0'", (done) => {
		chai.expect(colorHelper.colorParse("0")).to.be.equal("0.0000 0.0000 0.0000");
		done();
	});
});
