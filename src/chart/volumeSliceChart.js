import component from "../component.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Vertical Volume Slice Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myChart = d3.x3d.chart.volumeSliceChart();
 *    .dimensions({ x: 40, y: 40, z: 30 })
 *    .imageUrl("assets/scan2.png")
 *    .numberOfSlices(35)
 *    .slicesOverX(7)
 *    .slicesOverY(5);
 *
 * chartHolder.call(myChart);
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		debug: false,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		imageUrl: undefined,
		numberOfSlices: undefined,
		slicesOverX: undefined,
		slicesOverY: undefined,
		volumeStyle: "OpacityMap"
	};
	let classed = "d3X3dVolumeSliceChart";

	/* Scales */
	let origin = { x: 0, y: 0, z: 0 };

	/* Other Volume Properties */

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.crosshair();
	const volumeSlice = component.volumeSlice();

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias volumeSliceChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "volume"];
		const scene = createScene(selection, layers, classed, state.width, state.height, state.debug);

		selection.each(() => {

			// Add Viewpoint
			viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale);

			scene.select(".axis")
				.datum(origin)
				.call(axis);

			// Add Volume Slice
			volumeSlice.dimensions(state.dimensions)
				.imageUrl(state.imageUrl)
				.numberOfSlices(state.numberOfSlices)
				.slicesOverX(state.slicesOverX)
				.slicesOverY(state.slicesOverY)
				.volumeStyle(state.volumeStyle);

			scene.select(".volume")
				.append("transform")
				.attr("translation", () => {
					const x = state.dimensions.x / 2;
					const y = state.dimensions.y / 2;
					const z = state.dimensions.z / 2;
					return x + " " + y + " " + z;
				})
				.datum((d) => d)
				.call(volumeSlice);
		});
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {number} width - X3D canvas width in px.
	 * @param {number} height - X3D canvas height in px.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {string} imageUrl - Image URL path.
	 * @param {number} numberOfSlices - Total number of slices.
	 * @param {number} slicesOverX - Number of slices over X axis.
	 * @param {number} slicesOverY - Number of slices over Y axis.
	 * @param {string} volumeStyle - Volume render style (either "MPRVolume" or "OpacityMap")
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
