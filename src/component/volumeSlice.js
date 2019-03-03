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
		selection.classed(classed, true);
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;
		let html = `
				<transform>
				<volumedata id='volume' dimensions='${dimensionX} ${dimensionY} ${dimensionZ}'>
				<imagetextureatlas crossOrigin='anonymous' containerField='voxels' url='${imageUrl}' numberOfSlices='${numberOfSlices}' slicesOverX='${slicesOverX}' slicesOverY='${slicesOverY}'></imagetextureatlas>
				<opacitymapvolumestyle lightFactor='1.2' opacityFactor='6.0'>
					<imagetexture crossOrigin='anonymous' containerField='transferFunction' url='assets/transfer.png'></imagetexture>
				</opacitymapvolumestyle>
				</volumedata>
				</transform>
			`;

		selection.append("group").html(html);
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
