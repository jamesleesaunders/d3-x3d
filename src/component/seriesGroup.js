import * as d3 from "d3";
import dataTransform from "../dataTransform.js";

/**
 * Build x, y, and z scales from a summary when they are missing.
 * Pass `overwrite: true` to replace scales on every call.
 *
 * @param {Object} state
 * @param {Array} data
 * @param {{xScale: Function, yScale: Function, zScale: Function, overwrite: boolean}} scales
 * @returns {Object} dataTransform summary
 */
export function assignSeriesScales(state, data, scales) {
	const summary = dataTransform(data).summary();
	const dimensions = state.dimensions;

	["xScale", "yScale", "zScale"].forEach((key) => {
		if (scales.overwrite || typeof state[key] === "undefined") {
			state[key] = scales[key](summary, dimensions);
		}
	});

	return summary;
}

/**
 * Build linear x, y, z, and size scales from coordinate extents when missing.
 *
 * @param {Object} state
 * @param {Array} data
 * @returns {Array} Row keys
 */
export function assignCoordinateScales(state, data) {
	const { rowKeys, valueExtent, coordinatesExtent } = dataTransform(data).summary();
	const { x: extentX, y: extentY, z: extentZ } = coordinatesExtent;
	const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

	if (typeof state.xScale === "undefined") {
		state.xScale = d3.scaleLinear()
			.domain(extentX)
			.range([0, dimensionX]);
	}

	if (typeof state.yScale === "undefined") {
		state.yScale = d3.scaleLinear()
			.domain(extentY)
			.range([0, dimensionY]);
	}

	if (typeof state.zScale === "undefined") {
		state.zScale = d3.scaleLinear()
			.domain(extentZ)
			.range([0, dimensionZ]);
	}

	if (typeof state.sizeScale === "undefined") {
		state.sizeScale = d3.scaleLinear()
			.domain(valueExtent)
			.range(state.sizeRange);
	}

	return rowKeys;
}

/**
 * Reshape `{ value, x, y, z }` points into mapped `{ key, value }` pairs.
 *
 * @param {Array} data
 * @returns {Array}
 */
export function coordinateSeriesData(data) {
	return data.map((series) => ({
		key: series.key,
		values: series.values.map((point) => ({
			key: point.key,
			values: [
				{ key: "size", value: point.value },
				{ key: "color", value: point.value },
				{ key: "x", value: point.x },
				{ key: "y", value: point.y },
				{ key: "z", value: point.z }
			]
		}))
	}));
}

/**
 * Place one translated group per series and draw the inner component into it.
 *
 * @param {d3.selection} element
 * @param {Object} state
 * @param {{groupClass: string, mark: Function, configure: Function, colorBySeries: boolean}} options
 */
export function drawSeriesGroups(element, state, options) {
	const { groupClass, mark, configure, colorBySeries } = options;

	mark.xScale(state.xScale)
		.yScale(state.yScale)
		.dimensions({
			x: state.dimensions.x,
			y: state.dimensions.y,
			z: state.zScale.bandwidth()
		});

	if (configure) configure(mark);

	const groups = element.selectAll("." + groupClass)
		.data((d) => d, (d) => d.key);

	groups.enter()
		.append("Transform")
		.classed(groupClass, true)
		.merge(groups)
		.transition()
		.attr("translation", (d) => {
			const x = 0;
			const y = 0;
			const z = state.zScale(d.key);
			return x + " " + y + " " + z;
		})
		.each(function(d) {
			if (colorBySeries) mark.color(state.colorScale(d.key));
			d3.select(this).call(mark);
		});

	groups.exit()
		.remove();
}
