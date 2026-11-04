import * as d3 from "d3";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Crosshair Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["blue", "red", "green"],
		xScale: undefined,
		yScale: undefined,
		zScale: undefined
	};
	let classed = "d3X3dCrosshair";
	let radius = 0.1;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias crosshair
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			state.dimensions.x = state.xScale ? Math.max(...state.xScale.range()) : state.dimensions.x;
			state.dimensions.y = state.yScale ? Math.max(...state.yScale.range()) : state.dimensions.y;
			state.dimensions.z = state.zScale ? Math.max(...state.zScale.range()) : state.dimensions.z;

			const xOff = state.dimensions.x / 2;
			const yOff = state.dimensions.y / 2;
			const zOff = state.dimensions.z / 2;
			const xVal = state.xScale(data.x);
			const yVal = state.yScale(data.y);
			const zVal = state.zScale(data.z);

			function getPositionVector(axisDir) {
				const positionVectors = {
					x: [xOff, yVal, zVal],
					y: [xVal, yOff, zVal],
					z: [xVal, yVal, zOff]
				};

				return positionVectors[axisDir];
			}

			function getRotationVector(axisDir) {
				const rotationVectors = {
					x: [1, 1, 0, Math.PI],
					y: [1, 0, 1, Math.PI],
					z: [0, 1, 1, Math.PI]
				};

				return rotationVectors[axisDir];
			}

			const colorScale = d3.scaleOrdinal()
				.domain(Object.keys(state.dimensions))
				.range(state.colors);

			// Origin Ball
			const ballSelect = element.selectAll(".ball")
				.data([data]);

			let ball = ballSelect.enter()
				.append("Transform")
				.attr("translation", `${xVal} ${yVal} ${zVal}`)
				.classed("ball", true)
				.append("Shape");

			ball.append("Appearance")
				.append("Material")
				.attr("diffuseColor", colorParse("blue"));

			ball.append("Sphere")
				.attr("radius", 0.3);

			ball.merge(ballSelect);

			ballSelect.transition()
				.ease(d3.easeQuadOut)
				.attr("translation", `${xVal} ${yVal} ${zVal}`);

			// Crosshair Lines
			const lineSelect = element.selectAll(".line")
				.data(Object.keys(state.dimensions));

			const line = lineSelect.enter()
				.append("Transform")
				.classed("line", true)
				.attr("translation", (d) => getPositionVector(d).join(" "))
				.attr("rotation", (d) => getRotationVector(d).join(" "))
				.append("Shape");

			line.append("cylinder")
				.attr("radius", radius)
				.attr("height", (d) => state.dimensions[d]);

			line.append("Appearance")
				.append("Material")
				.attr("diffuseColor", (d) => colorParse(colorScale(d)));

			line.merge(lineSelect);

			lineSelect.transition()
				.ease(d3.easeQuadOut)
				.attr("translation", (d) => getPositionVector(d).join(" "));
		});
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 */
	attachAccessors(my, state);

	return my;
}
