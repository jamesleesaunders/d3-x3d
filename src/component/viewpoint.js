import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Viewpoint
 *
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
	 */
	function my(selection) {
		selection.append("viewpoint")
			.attr("position", viewPosition.join(" "))
			.attr("orientation", viewOrientation.join(" "))
			.attr("fieldOfView", fieldOfView)
			.attr("set_bind", "true");
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.viewPosition = function(_) {
		if (!arguments.length) return viewPosition;
		viewPosition = _;
		return my;
	};

	my.viewOrientation = function(_) {
		if (!arguments.length) return viewOrientation;
		viewOrientation = _;
		return my;
	};

	my.fieldOfView = function(_) {
		if (!arguments.length) return fieldOfView;
		fieldOfView = _;
		return my;
	};

	return my;
}
