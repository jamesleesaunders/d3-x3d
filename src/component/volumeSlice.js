import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Volume Slice Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		imageUrl: undefined,
		numberOfSlices: undefined,
		slicesOverX: undefined,
		slicesOverY: undefined,
		volumeStyle: "OpacityMap"
	};
	let classed = "d3X3dVolumeSlice";

	/* Other Volume Properties */

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

			const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

			const volumedata = element.append("Transform")
				.append("VolumeData")
				.attr("dimensions", `${dimensionX} ${dimensionY} ${dimensionZ}`);

			volumedata.append("ImageTextureAtlas")
				.attr("crossOrigin", "anonymous")
				.attr("containerField", "voxels")
				.attr("url", state.imageUrl)
				.attr("numberOfSlices", state.numberOfSlices)
				.attr("slicesOverX", state.slicesOverX)
				.attr("slicesOverY", state.slicesOverY);

			switch (state.volumeStyle) {
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
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {string} imageUrl - Image URL path.
	 * @param {number} numberOfSlices - Total number of slices.
	 * @param {number} slicesOverX - Number of slices over X axis.
	 * @param {number} slicesOverY - Number of slices over Y axis.
	 * @param {string} volumeStyle - Volume render style (either "MPRVolume" or "OpacityMap")
	 */
	attachAccessors(my, state);

	return my;
}
