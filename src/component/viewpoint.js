import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Viewpoint
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
