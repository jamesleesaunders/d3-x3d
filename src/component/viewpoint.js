import * as d3 from "d3";

/**
 * Reusable X3DOM Viewpoint Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let centerOfRotation = [0.0, 0.0, 0.0];
	let viewPosition = [80.0, 15.0, 80.0];
	let viewOrientation = [0.0, 1.0, 0.0, 0.8];
	let fieldOfView = 0.8;
	let classed = "x3dViewpoint";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias viewpoint
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.append("viewpoint")
			.classed(classed, true)
			.attr("centerofrotation", centerOfRotation.join(" "))
			.attr("position", viewPosition.join(" "))
			.attr("orientation", viewOrientation.join(" "))
			.attr("fieldofview", fieldOfView)
			.attr("set_bind", "true");
	}

	/**
	 * Set Quick Viewpoint
	 *
	 * @param {string} view - 'left', 'side', 'top', 'dimetric'
	 * @returns {my}
	 */
	my.quickView = function(view) {
		switch (view) {
			case "left":
				centerOfRotation = [0.0, 0.0, 0.0];
				viewPosition = [37.10119, 18.70484, 51.01594];
				viewOrientation = [0.06724, 0.99767, -0.01148, 0.33908];
				fieldOfView = 1.0;
				break;

			case "side":
				centerOfRotation = [20.0, 0.0, 0.0];
				viewPosition = [20.00000, 20.00000, 50.00000];
				viewOrientation = [0.00000, 0.00000, 0.00000, 0.00000];
				fieldOfView = 1.0;
				break;

			case "top":
				centerOfRotation = [0.0, 0.0, 0.0];
				viewPosition = [27.12955, 106.67181, 31.65828];
				viewOrientation = [-0.86241, 0.37490, 0.34013, 1.60141];
				fieldOfView = 1.0;
				break;

			case "dimetric":
			default:
				centerOfRotation = [0.0, 0.0, 0.0];
				viewPosition = [80.0, 15.0, 80.0];
				viewOrientation = [0.0, 1.0, 0.0, 0.8];
				fieldOfView = 0.8;
		}
		return my;
	};

	/**
	 * Centre of Rotation Getter / Setter
	 *
	 * @param {number[]} _v - Centre of rotation.
	 * @returns {*}
	 */
	my.centerOfRotation = function(_v) {
		if (!arguments.length) return centerOfRotation;
		centerOfRotation = _v;
		return my;
	};

	/**
	 * View Position Getter / Setter
	 *
	 * @param {number[]} _v - View position.
	 * @returns {*}
	 */
	my.viewPosition = function(_v) {
		if (!arguments.length) return viewPosition;
		viewPosition = _v;
		return my;
	};

	/**
	 * View Orientation Getter / Setter
	 *
	 * @param {number[]} _v - View orientation.
	 * @returns {*}
	 */
	my.viewOrientation = function(_v) {
		if (!arguments.length) return viewOrientation;
		viewOrientation = _v;
		return my;
	};

	/**
	 * Field of View Getter / Setter
	 *
	 * @param {number} _v - Field of view.
	 * @returns {*}
	 */
	my.fieldOfView = function(_v) {
		if (!arguments.length) return fieldOfView;
		fieldOfView = _v;
		return my;
	};

	return my;
}
