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
	let viewPosition = [80.0, 15.0, 80.0];
	let viewOrientation = [0.0, 1.0, 0.0, 0.8];
	let fieldOfView = 0.8;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
	 */
	function my(selection) {
		selection.append("viewpoint")
			.attr("position", viewPosition.join(" "))
			.attr("orientation", viewOrientation.join(" "))
			.attr("fieldOfView", fieldOfView)
			.attr("set_bind", "true");
	}

	/**
	 * Set Quick Viewpoint
	 *
	 * @param {string} view - 'left', 'top', 'front'
	 * @returns {my}
	 */
	my.quickView = function(view) {
		switch (view) {
			case "left":
				viewPosition = [18.41614, 20.45000, 53.52338];
				viewOrientation = [0.0, 0.0, 0.0, 0.0];
				fieldOfView = 1.0;
				break;
			case "top":
				viewPosition = [27.12955, 106.67181, 31.65828];
				viewOrientation = [-0.86241, 0.37490, 0.34013, 1.60141];
				fieldOfView = 1.0;
				break;
			case "front":
			default:
				viewPosition = [80.0, 15.0, 80.0];
				viewOrientation = [0.0, 1.0, 0.0, 0.8];
				fieldOfView = 0.8;
		}
		return my;
	};

	/**
	 * View Position Getter / Setter
	 *
	 * @param {[{number}, {number}, {number}]} _
	 * @returns {*}
	 */
	my.viewPosition = function(_) {
		if (!arguments.length) return viewPosition;
		viewPosition = _;
		return my;
	};

	/**
	 * View Orientation Getter / Setter
	 *
	 * @param {[{number}, {number}, {number}, {number}]} _
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
