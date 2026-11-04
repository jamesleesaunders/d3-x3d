import * as d3 from "d3";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable X3D Viewpoint Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		centerOfRotation: [0.0, 0.0, 0.0],
		viewPosition: [80.0, 15.0, 80.0],
		viewOrientation: [0.0, 1.0, 0.0, 0.8],
		fieldOfView: 0.8
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias viewpoint
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function() {
			const viewpoint = d3.select(this).selectAll("viewpoint")
				.data([null]);

			viewpoint.enter()
				.append("Viewpoint")
				.attr("centerOfRotation", state.centerOfRotation.join(" "))
				.attr("position", state.viewPosition.join(" "))
				.attr("orientation", state.viewOrientation.join(" "))
				.attr("fieldOfView", state.fieldOfView)
				.attr("set_bind", "true")
				.merge(viewpoint);
		});
	};

	/**
	 * Set Quick Viewpoint
	 *
	 * @param {string} view - "left", "side", "top", "dimetric"
	 * @returns {my}
	 */
	my.quickView = function(view) {
		switch (view) {
			case "left":
				state.centerOfRotation = [0.0, 0.0, 0.0];
				state.viewPosition = [37.10119, 18.70484, 51.01594];
				state.viewOrientation = [0.06724, 0.99767, -0.01148, 0.33908];
				state.fieldOfView = 1.0;
				break;

			case "side":
				state.centerOfRotation = [20.0, 0.0, 0.0];
				state.viewPosition = [20.00000, 20.00000, 50.00000];
				state.viewOrientation = [0.00000, 0.00000, 0.00000, 0.00000];
				state.fieldOfView = 1.0;
				break;

			case "top":
				state.centerOfRotation = [0.0, 0.0, 0.0];
				state.viewPosition = [27.12955, 106.67181, 31.65828];
				state.viewOrientation = [-0.86241, 0.37490, 0.34013, 1.60141];
				state.fieldOfView = 1.0;
				break;

			case "dimetric":
			default:
				state.centerOfRotation = [0.0, 0.0, 0.0];
				state.viewPosition = [80.0, 15.0, 80.0];
				state.viewOrientation = [0.0, 1.0, 0.0, 0.8];
				state.fieldOfView = 0.8;
		}
		return my;
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {number[]} centerOfRotation - Centre of rotation.
	 * @param {number[]} viewPosition - View position.
	 * @param {number[]} viewOrientation - View orientation.
	 * @param {number} fieldOfView - Field of view.
	 */
	attachAccessors(my, state);

	return my;
}
