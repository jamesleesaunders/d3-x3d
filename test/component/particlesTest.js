import test from "tape";
import d3X3d from "../../index.js"
test("Test Particles Component, component.particles()", function(t) {
	let particles = d3X3d.component.particles();
	t.equal("test", "test", "Test");

	// Test dimensions getter / setter function
	t.deepEqual(particles.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	particles.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(particles.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(particles.xScale(), undefined, "Default xScale is undefined");
	particles.xScale(0.2);
	t.equal(particles.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(particles.yScale(), undefined, "Default yScale is undefined");
	particles.yScale(0.1);
	t.equal(particles.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(particles.zScale(), undefined, "Default zScale is undefined");
	particles.zScale(0.2);
	t.equal(particles.zScale(), 0.2, "Changed zScale is set");

	// Test color getter / setter function
	t.equal(particles.color(), undefined, "Default color");
	particles.color("yellow");
	t.equal(particles.color(), "yellow", "Changed color");

	// Test colors getter / setter function
	t.deepEqual(particles.colors(), ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"], "Default colors");
	particles.colors(["red", "green"]);
	t.deepEqual(particles.colors(), ["red", "green"], "Changed colors");

	t.end();
});
