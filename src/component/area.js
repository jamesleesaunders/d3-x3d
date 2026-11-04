import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Area Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 5 },
		color: "blue",
		smoothed: d3.curveMonotoneX,
		xScale: undefined,
		yScale: undefined
	};
	let transparency = 0.1;
	let classed = "d3X3dArea";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];
		const { x: dimensionX, y: dimensionY } = state.dimensions;

		if (typeof state.xScale === "undefined") {
			state.xScale = d3.scalePoint()
				.domain(columnKeys)
				.range([0, dimensionX]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias area
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const areaData = function(data) {
				const dimensionX = state.dimensions.x;

				if (state.smoothed) {
					data = dataTransform(data).smooth(state.smoothed, 100);

					const keys = d3.extent(data.values.map((d) => d.key));
					state.xScale = d3.scaleLinear()
						.domain(keys)
						.range([0, dimensionX]);
				}

				let values = data.values;

				// Convert values into IFS coordinates
				let coords = values.map((pointThis, indexThis, array) => {
					let indexNext = indexThis + 1;
					if (indexNext >= array.length) {
						return null;
					}
					let pointNext = array[indexNext];

					let x1 = state.xScale(pointThis.key);
					let x2 = state.xScale(pointNext.key);
					let y1 = state.yScale(pointThis.value);
					let y2 = state.yScale(pointNext.value);

					return [x1, 0, 0, x1, y1, 0, x2, y2, 0, x2, 0, 0];
				}).filter((d) => d !== null);

				data.point = coords.map((d) => d.join(" ")).join(" ");
				data.coordIndex = coords.map((d, i) => {
					const offset = i * 4;
					return [offset, offset + 1, offset + 2, offset + 3, -1].join(" ");
				}).join(" ");

				return [data];
			};

			const shape = (el) => {
				const shape = el.append("Shape");

				/*
				// FIXME: x3dom cannot have empty IFS nodes, we must to use .html() rather than .append() & .attr().
				shape.append("IndexedFaceset")
					.attr("coordIndex", (d) => d.coordIndex)
					.append("Coordinate")
					.attr("point", (d) => d.point);

				shape.append("Appearance")
					.append("Material")
					.attr("diffuseColor", colorParse(color))
					.attr("transparency", transparency);
				*/

				shape.html((d) => `
					<IndexedFaceset coordIndex="${d.coordIndex}" solid="false">
						<Coordinate point="${d.point}"></Coordinate>
					</IndexedFaceset>
					<Appearance>
						<Material diffuseColor="${colorParse(state.color)}" transparency="${transparency}"></Material>
					</Appearance>
				`);
			};

			const area = element.selectAll(".area")
				.data((d) => areaData(d), (d) => d.key);

			area.enter()
				.append("Group")
				.classed("area", true)
				.call(shape)
				.merge(area);

			const areaTransition = area.transition().select("Shape");

			areaTransition.select("IndexedFaceset")
				.attr("coordIndex", (d) => d.coordIndex)
				.select("Coordinate")
				.attr("point", (d) => d.point);

			areaTransition.select("Appearance")
				.select("Material")
				.attr("diffuseColor", colorParse(state.color));

			area.exit()
				.remove();
		});
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} dimensions - 3D Object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {string} color - Color (e.g. "red" or "#ff0000").
	 * @param {d3.curve} smoothed
	 */
	attachAccessors(my, state);

	return my;
}
