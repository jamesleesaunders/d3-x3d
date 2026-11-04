import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { colorParse } from "../colorHelper.js";

/**
 * Draw a strip of quads as an IndexedFaceSet.
 *
 * X3DOM rejects an empty IndexedFaceSet, so the node is injected with .html().
 *
 * @param {d3.selection} element
 * @param {Object} state - Component scales, color, dimensions, and curve.
 * @param {{itemClass: string, transparency: number, quad: Function}} options
 */
export function drawIndexedFaceStrip(element, state, options) {
	const { itemClass, transparency, quad } = options;
	const faceData = function(series) {
		if (state.smoothed) {
			series = dataTransform(series).smooth(state.smoothed, 100);

			const keys = d3.extent(series.values.map((d) => d.key));
			state.xScale = d3.scaleLinear()
				.domain(keys)
				.range([0, state.dimensions.x]);
		}

		const coords = series.values.map((pointThis, indexThis, array) => {
			const indexNext = indexThis + 1;
			if (indexNext >= array.length) {
				return null;
			}
			return quad(pointThis, array[indexNext]);
		}).filter((d) => d !== null);

		series.point = coords.map((d) => d.join(" ")).join(" ");
		series.coordIndex = coords.map((d, i) => {
			const offset = i * 4;
			return [offset, offset + 1, offset + 2, offset + 3, -1].join(" ");
		}).join(" ");

		return [series];
	};

	const shape = (el) => {
		const node = el.append("Shape");

		node.html((d) => `
			<IndexedFaceset coordIndex="${d.coordIndex}" solid="false">
				<Coordinate point="${d.point}"></Coordinate>
			</IndexedFaceset>
			<Appearance>
				<Material diffuseColor="${colorParse(state.color)}" transparency="${transparency}"></Material>
			</Appearance>
		`);
	};

	const items = element.selectAll("." + itemClass)
		.data((d) => faceData(d), (d) => d.key);

	items.enter()
		.append("Group")
		.classed(itemClass, true)
		.call(shape)
		.merge(items);

	const itemTransition = items.transition().select("Shape");

	itemTransition.select("IndexedFaceset")
		.attr("coordIndex", (d) => d.coordIndex)
		.select("Coordinate")
		.attr("point", (d) => d.point);

	itemTransition.select("Appearance")
		.select("Material")
		.attr("diffuseColor", colorParse(state.color));

	items.exit()
		.remove();
}
