import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { createScene } from "../base.js";
import { dispatch } from "../events.js";
import { attachAccessors } from "../accessors.js";

/**
 * Column point scales shared by the area and ribbon charts.
 * Scales are replaced on every call.
 *
 * @param {Array} data
 * @param {Object} state
 */
export function initColumnPointScales(data, state) {
	const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
	const valueExtent = [0, valueMax];
	const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

	state.xScale = d3.scalePoint()
		.domain(columnKeys)
		.range([0, dimensionX]);

	state.yScale = d3.scaleLinear()
		.domain(valueExtent)
		.range([0, dimensionY])
		.nice();

	state.zScale = d3.scaleBand()
		.domain(rowKeys)
		.range([0, dimensionZ])
		.padding(0.4);

	state.colorScale = d3.scaleOrdinal()
		.domain(columnKeys)
		.range(state.colors);
}

/**
 * Viewpoint orientation shared by the area and ribbon charts.
 *
 * @param {Function} viewpoint
 */
export function orientSeriesViewpoint(viewpoint) {
	viewpoint.viewOrientation([-0.61021, 0.77568, 0.16115, 0.65629])
		.viewPosition([77.63865, 54.69470, 104.38314]);
}

/**
 * Linear coordinate scales shared by the bubble chart and spot plot.
 * Scales are replaced on every call.
 *
 * @param {Array} data
 * @param {Object} state
 */
export function initCoordinateScales(data, state) {
	const { valueExtent, coordinatesExtent, rowKeys } = dataTransform(data).summary();
	const { x: extentX, y: extentY, z: extentZ } = coordinatesExtent;
	const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

	state.xScale = d3.scaleLinear()
		.domain(extentX)
		.range([0, dimensionX]);

	state.yScale = d3.scaleLinear()
		.domain(extentY)
		.range([0, dimensionY]);

	state.zScale = d3.scaleLinear()
		.domain(extentZ)
		.range([0, dimensionZ]);

	state.colorScale = d3.scaleOrdinal()
		.domain(rowKeys)
		.range(state.colors);

	state.sizeScale = d3.scaleLinear()
		.domain(valueExtent)
		.range(state.sizeRange);
}

/**
 * Build a chart that creates a scene, viewpoint, axis, mark, and optional light.
 * `init` assigns scales on every call. `draw` covers marks that are not a single layer call.
 *
 * @param {Object} spec
 * @returns {Function}
 */
export function sceneChart(spec) {
	const state = { ...spec.state };
	const viewpoint = component.viewpoint();
	const axis = spec.axis();
	const mark = spec.mark();
	const light = spec.light ? component.light() : null;

	const my = function(selection) {
		const scene = createScene(
			selection,
			spec.layers,
			spec.classed,
			state.width,
			state.height,
			state.debug
		);

		selection.each((data) => {
			spec.init(data, state);

			viewpoint.centerOfRotation([
				state.dimensions.x / 2,
				state.dimensions.y / 2,
				state.dimensions.z / 2
			]);
			if (spec.viewpoint) spec.viewpoint(viewpoint, state);
			scene.call(viewpoint);

			axis.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale);
			if (spec.configureAxis) spec.configureAxis(axis, state);
			scene.select(".axis")
				.call(axis);

			mark.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale);
			if (spec.configureMark) spec.configureMark(mark, state);
			if (spec.markLayer) {
				scene.select(spec.markLayer)
					.datum(data)
					.call(mark);
			}
			if (spec.draw) {
				spec.draw({
					scene,
					state,
					mark,
					data
				});
			}
			if (light) scene.call(light);
		});
	};

	if (spec.events) {

		/**
		 * Dispatch On Getter
		 *
		 * @returns {*}
		 */
		my.on = function() {
			let value = dispatch.on.apply(dispatch, arguments);
			return value === dispatch ? my : value;
		};
	}

	attachAccessors(my, state);

	return my;
}
