import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Volume Slice Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let classed = "d3X3domVolume";

	let imageUrl = "assets/scan1.png";
	let numberOfSlices = 96;
	let slicesOverX = 10;
	let slicesOverY = 10;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bars
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			const element = d3.select(this)
				.classed(classed, true);

			let sliceMode = true;

			const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

			const volumeEnter = element.append("transform")
				.classed("volume", true)
				.append("volumedata")
				.attr("dimensions", `${dimensionX} ${dimensionY} ${dimensionZ}`);

			volumeEnter.append("imagetextureatlas")
				.attr("crossorigin", "anonymous")
				.attr("containerfield", "voxels")
				.attr("url", imageUrl)
				.attr("numberofslices", numberOfSlices)
				.attr("slicesoverx", slicesOverX)
				.attr("slicesovery", slicesOverY);

			if (!sliceMode) {
				volumeEnter.append("opacitymapvolumestyle")
					.attr("lightfactor", 1.2)
					.attr("opacityfactor", 6.0)
					.append("imagetexture")
					.attr("crossorigin", 'anonymous')
					.attr("containerfield", 'transferFunction')
					.attr("url", 'assets/transfer.png');
			} else {
				let positionLine = data.values[0].value;
				let { x, y, z } = data.values[0];
				let finalLine = x + " " + y + " " + z;

				volumeEnter.append("mprvolumestyle")
					.attr("finalLine", finalLine)
					.attr("positionLine", positionLine);
			}
		});
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_v) {
		if (!arguments.length) return dimensions;
		dimensions = _v;
		return this;
	};

	/**
	 * Image URL Getter / Setter
	 *
	 * @param {string} _v - Image URL path.
	 * @returns {*}
	 */
	my.imageUrl = function(_v) {
		if (!arguments.length) return imageUrl;
		imageUrl = _v;
		return this;
	};

	/**
	 * Number of Slices Getter / Setter
	 *
	 * @param {number} _v - Total number of slices.
	 * @returns {*}
	 */
	my.numberOfSlices = function(_v) {
		if (!arguments.length) return numberOfSlices;
		numberOfSlices = _v;
		return this;
	};

	/**
	 * X Slices Getter / Setter
	 *
	 * @param {number} _v - Number of slices over X axis.
	 * @returns {*}
	 */
	my.slicesOverX = function(_v) {
		if (!arguments.length) return slicesOverX;
		slicesOverX = _v;
		return this;
	};

	/**
	 * Y Slices Getter / Setter
	 *
	 * @param {number} _v - Number of slices over Y axis.
	 * @returns {*}
	 */
	my.slicesOverY = function(_v) {
		if (!arguments.length) return slicesOverY;
		slicesOverY = _v;
		return this;
	};

	return my;
}
