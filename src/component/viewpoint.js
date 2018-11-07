import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable X3DOM Viewpoint
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let centerOfRotation = [0.0, 0.0, 0.0];
	let viewPosition = [80.0, 15.0, 80.0];
	let viewOrientation = [0.0, 1.0, 0.0, 0.8];
	let fieldOfView = 0.8;
	let classed = "x3dViewpoint";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
	 */
	function my(selection) {
		selection.append("viewpoint")
			.classed(classed, true)
			.attr("centerOfRotation", centerOfRotation.join(" "))
			.attr("position", viewPosition.join(" "))
			.attr("orientation", viewOrientation.join(" "))
			.attr("fieldOfView", fieldOfView)
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
	 * View Position Getter / Setter
	 *
	 * @param {[number, number, number]} _
	 * @returns {*}
	 */
	my.centerOfRotation = function(_) {
		if (!arguments.length) return centerOfRotation;
		centerOfRotation = _;
		return my;
	};

	my.viewPosition = function(_) {
		if (!arguments.length) return viewPosition;
		viewPosition = _;
		return my;
	};

	/**
	 * View Orientation Getter / Setter
	 *
	 * @param {[number, number, number, number]} _
	 * @returns {*}
	 */
	my.viewOrientation = function(_) {
		if (!arguments.length) return viewOrientation;
		viewOrientation = _;
		return my;
	};

	/**
	 * Field of View Getter / Setter
	 *
	 * @param {number} _
	 * @returns {*}
	 */
	my.fieldOfView = function(_) {
		if (!arguments.length) return fieldOfView;
		fieldOfView = _;
		return my;
	};

	return my;
}
