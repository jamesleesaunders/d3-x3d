let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Viewpoint Base Component, component.viewpoint()", function(t) {
	let viewPoint = d3X3d.component.viewpoint();

	// Test centerOfRotation getter / setter function
	t.deepEqual(viewPoint.centerOfRotation(), [0.0, 0.0, 0.0], "Default centerOfRotation");
	viewPoint.centerOfRotation([1.0, 1.0, 1.0]);
	t.deepEqual(viewPoint.centerOfRotation(), [1.0, 1.0, 1.0], "Changed centreOfRotation");

	// Test viewPosition getter / setter function
	t.deepEqual(viewPoint.viewPosition(), [80.0, 15.0, 80.0], "Default viewPosition");
	viewPoint.viewPosition([100.0, 100.0, 100.0]);
	t.deepEqual(viewPoint.viewPosition(), [100.0, 100.0, 100.0], "Changed viewPosition");

	// Test viewOrientation getter / setter function
	t.deepEqual(viewPoint.viewOrientation(), [0.0, 1.0, 0.0, 0.8], "Default viewOrientation");
	viewPoint.viewOrientation([1.0, 0.0, 0.0, 0.8]);
	t.deepEqual(viewPoint.viewOrientation(), [1.0, 0.0, 0.0, 0.8], "Changed viewOrientation");

	// Test fieldOfView getter / setter function
	t.deepEqual(viewPoint.fieldOfView(), 0.8, "Default fieldOfView");
	viewPoint.fieldOfView(1.0);
	t.deepEqual(viewPoint.fieldOfView(), 1.0, "Changed fieldOfView");

	t.end();
});

test("Test Component Viewpoint Quick View, viewpoint.quickView()", function(t) {
	let viewPoint = d3X3d.component.viewpoint();
	let viewPoints = {
		left: {
			centerOfRotation: [0.0, 0.0, 0.0],
			viewPosition: [37.10119, 18.70484, 51.01594],
			viewOrientation: [0.06724, 0.99767, -0.01148, 0.33908],
			fieldOfView: 1.0
		},
		side: {
			centerOfRotation: [20.0, 0.0, 0.0],
			viewPosition: [20.00000, 20.00000, 50.00000],
			viewOrientation: [0.00000, 0.00000, 0.00000, 0.00000],
			fieldOfView: 1.0
		},
		top: {
			centerOfRotation: [0.0, 0.0, 0.0],
			viewPosition: [27.12955, 106.67181, 31.65828],
			viewOrientation: [-0.86241, 0.37490, 0.34013, 1.60141],
			fieldOfView: 1.0
		},
		dimetric: {
			centerOfRotation: [0.0, 0.0, 0.0],
			viewPosition: [80.0, 15.0, 80.0],
			viewOrientation: [0.0, 1.0, 0.0, 0.8],
			fieldOfView: 0.8
		}
	};
	let { left, side, top, dimetric } = viewPoints;

	test("Test default values for left view", function(t) {
		viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView('left');

		t.deepEqual(viewPoint.centerOfRotation(), left.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), left.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), left.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), left.fieldOfView);

		t.end();
	});

	test("Test default values for top view", function(t) {
		viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView('top');

		t.deepEqual(viewPoint.centerOfRotation(), top.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), top.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), top.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), top.fieldOfView);

		t.end();
	});

	test("Test default values for side view", function(t) {
		viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView('side');

		t.deepEqual(viewPoint.centerOfRotation(), side.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), side.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), side.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), side.fieldOfView);

		t.end();
	});

	test("Test default values for dimetric view", function(t) {
		viewPoint = d3X3d.component.viewpoint();
		viewPoint.quickView('dimetric');

		t.deepEqual(viewPoint.centerOfRotation(), dimetric.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), dimetric.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), dimetric.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), dimetric.fieldOfView);

		t.end();
	});

	t.end()
});
