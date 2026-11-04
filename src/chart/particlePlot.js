import * as d3 from "d3";
import { extentsFromMappings } from "../extentsFromMappings.js";
import component from "../component.js";
import { sceneChart } from "./sceneChart.js";

/**
 * Reusable 3D Particle Plot Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.particlePlot();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 *
 * @param {number} width - X3D canvas width in px.
 * @param {number} height - X3D canvas height in px.
 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
 * @param {d3.scale} xScale - D3 scale.
 * @param {d3.scale} yScale - D3 scale.
 * @param {d3.scale} zScale - D3 scale.
 * @param {d3.scale} colorScale - D3 color scale.
 * @param {string} color - Color (e.g. "red" or "#ff0000").
 * @param {Array} colors - Array of colours used by color scale.
 * @param {Object} mappings - Map properties to colour etc.
 * @param {boolean} debug - Show debug log and stats. True/False.
 */
export default function() {
	return sceneChart({
		classed: "d3X3dParticlePlot",
		layers: ["axis", "particles"],
		markLayer: ".particles",
		events: true,
		state: {
			width: 500,
			height: 500,
			dimensions: { x: 40, y: 40, z: 40 },
			colors: ["orange"],
			color: undefined,
			mappings: undefined,
			debug: false,
			xScale: undefined,
			yScale: undefined,
			zScale: undefined,
			colorScale: undefined
		},
		axis: () => component.axisThreePlane(),
		mark: () => component.particles(),
		init(data, chartState) {
			const newData = extentsFromMappings(data, chartState.mappings, ["x", "y", "z", "color"]);

			let extentX = newData.x.valueExtent;
			let extentY = newData.y.valueExtent;
			let extentZ = newData.z.valueExtent;
			let extentColor = newData.color.valueExtent;

			chartState.xScale = d3.scaleLinear()
				.domain(extentX)
				.range([0, chartState.dimensions.x]);

			chartState.yScale = d3.scaleLinear()
				.domain(extentY)
				.range([0, chartState.dimensions.y]);

			chartState.zScale = d3.scaleLinear()
				.domain(extentZ)
				.range([0, chartState.dimensions.z]);

			if (chartState.color) {
				chartState.colorScale = d3.scaleQuantize()
					.domain(extentColor)
					.range([chartState.color, chartState.color]);
			} else {
				chartState.colorScale = d3.scaleQuantize()
					.domain(extentColor)
					.range(chartState.colors);
			}
		},
		configureMark(mark, chartState) {
			mark.mappings(chartState.mappings)
				.colorScale(chartState.colorScale);
		}
	});
}
