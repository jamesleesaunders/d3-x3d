let d3X3dom = require("../");
let tape = require("tape");

tape("Text viewpoint quickView, viewpoint.quickView(), ", function(test) {
	let viewPoint = d3X3dom.component.viewpoint();
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

	tape("Test default values for left side view", (t) => {
		viewPoint = d3X3dom.component.viewpoint();
		viewPoint.quickView('left');

		t.deepEqual(viewPoint.centerOfRotation(), left.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), left.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), left.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), left.fieldOfView);

		t.end();
	});

	tape("Test default values for top side view", (t) => {
		viewPoint = d3X3dom.component.viewpoint();
		viewPoint.quickView('top');

		t.deepEqual(viewPoint.centerOfRotation(), top.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), top.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), top.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), top.fieldOfView);

		t.end();
	});

	tape("Test default values for side view", (t) => {
		viewPoint = d3X3dom.component.viewpoint();
		viewPoint.quickView('side');

		t.deepEqual(viewPoint.centerOfRotation(), side.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), side.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), side.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), side.fieldOfView);

		t.end();
	});

	tape("Test default values for dimetric and default view option side", (t) => {
		viewPoint = d3X3dom.component.viewpoint();
		viewPoint.quickView('dimetric');

		t.deepEqual(viewPoint.centerOfRotation(), dimetric.centerOfRotation);
		t.deepEqual(viewPoint.viewPosition(), dimetric.viewPosition);
		t.deepEqual(viewPoint.viewOrientation(), dimetric.viewOrientation);
		t.deepEqual(viewPoint.fieldOfView(), dimetric.fieldOfView);

		t.end();
	});

	test.end()
});

tape("Test ViewPoint Base, viewpoint()", function(test) {
	let viewPoint = d3X3dom.component.viewpoint();

	// Test Getter and Setter functions for Center of Rotation
	test.deepEqual(viewPoint.centerOfRotation(), [0.0, 0.0, 0.0], "Center of rotation should [0.0, 0.0, 0.0]");
	viewPoint.centerOfRotation([1.0, 1.0, 1.0]);
	test.deepEqual(viewPoint.centerOfRotation(), [1.0, 1.0, 1.0]);

	// Test Getter and Setter functions for view position
	test.deepEqual(viewPoint.viewPosition(), [80.0, 15.0, 80.0], "View position should be [80.0, 15.0, 80.0]");
	viewPoint.viewPosition([100.0, 100.0, 100.0]);
	test.deepEqual(viewPoint.viewPosition(), [100.0, 100.0, 100.0]);

	// Test Getter and Setter functions for view orientation
	test.deepEqual(viewPoint.viewOrientation(), [0.0, 1.0, 0.0, 0.8], "View orientation should be [0.0, 1.0, 0.0, 0.8]");
	viewPoint.viewOrientation([1.0, 0.0, 0.0, 0.8]);
	test.deepEqual(viewPoint.viewOrientation(), [1.0, 0.0, 0.0, 0.8]);

	// Test Getter and Setter functions for field of view
	test.deepEqual(viewPoint.fieldOfView(), 0.8, "Field of view should be 0.8");
	viewPoint.fieldOfView(1.0);
	test.deepEqual(viewPoint.fieldOfView(), 1.0);

	test.end()
});

