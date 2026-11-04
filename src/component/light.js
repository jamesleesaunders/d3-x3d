import * as d3 from "d3";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable X3D Light Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		direction: "1 0 -1",
		intensity: 0.5,
		shadowIntensity: 0
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias light
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function() {
			const light = d3.select(this).selectAll("DirectionalLight")
				.data([null]);

			light.enter()
				.append("DirectionalLight")
				.attr("on", true)
				.attr("direction", state.direction)
				.attr("intensity", state.intensity)
				.attr("shadowIntensity", state.shadowIntensity)
				.merge(light);
		});
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {string} direction - Direction vector (e.g. "1 0 -1").
	 * @param {number} intensity - Intensity value.
	 * @param {number} shadowIntensity - Intensity value.
	 */
	attachAccessors(my, state);

	return my;
}
