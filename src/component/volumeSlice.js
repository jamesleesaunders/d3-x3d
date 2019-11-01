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
	let classed = "d3X3dVolumeSlice";

	/* Other Volume Properties */
	let imageUrl;
	let numberOfSlices;
	let slicesOverX;
	let slicesOverY;
	let volumeStyle = "OpacityMap";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias volumeSlice
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

			const volumedata = element.append("Transform")
				.append("VolumeData")
				.attr("dimensions", `${dimensionX} ${dimensionY} ${dimensionZ}`);

			volumedata.append("ImageTextureAtlas")
				.attr("crossOrigin", "anonymous")
				.attr("containerField", "voxels")
				.attr("url", imageUrl)
				.attr("numberOfSlices", numberOfSlices)
				.attr("slicesOverX", slicesOverX)
				.attr("slicesOverY", slicesOverY);

			switch (volumeStyle) {
				case "MPRVolume":
					volumedata.append("MPRVolumeStyle")
						.attr("forceOpaic", true)
						.selectAll(".plane")
						.data((d) => d.values)
						.enter()
						.append("MPRPlane")
						.classed("plane", true)
						.attr("normal", (d) => `${d.x} ${d.y} ${d.z}`)
						.attr("position", (d) => d.value);
					break;

				case "OpacityMap":
				default:
					volumedata.append("OpacityMapVolumeStyle")
						.attr("lightFactor", 1.2)
						.attr("opacityFactor", 6.0);
					break;
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

	/**
	 * Volume Style Getter / Setter
	 *
	 * @param {string} _v - Volume render style (either "MPRVolume" or "OpacityMap")
	 * @returns {*}
	 */
	my.volumeStyle = function(_v) {
		if (!arguments.length) return volumeStyle;
		volumeStyle = _v;
		return this;
	};

	return my;
}
