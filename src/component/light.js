import * as d3 from "d3";

/**
 * Reusable X3D Light Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let direction = "1 0 -1";
	let intensity = 0.5;
	let shadowIntensity = 0;

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
				.attr("direction", direction)
				.attr("intensity", intensity)
				.attr("shadowIntensity", shadowIntensity)
				.merge(light);
		});
	};

	/**
	 * Light Direction Getter / Setter
	 *
	 * @param {string} _v - Direction vector (e.g. "1 0 -1").
	 * @returns {*}
	 */
	my.direction = function(_v) {
		if (!arguments.length) return direction;
		direction = _v;
		return my;
	};

	/**
	 * Light Intensity Getter / Setter
	 *
	 * @param {number} _v - Intensity value.
	 * @returns {*}
	 */
	my.intensity = function(_v) {
		if (!arguments.length) return intensity;
		intensity = _v;
		return my;
	};

	/**
	 * Shadow Intensity Getter / Setter
	 *
	 * @param {number} _v - Intensity value.
	 * @returns {*}
	 */
	my.shadowIntensity = function(_v) {
		if (!arguments.length) return shadowIntensity;
		shadowIntensity = _v;
		return my;
	};

	return my;
}
