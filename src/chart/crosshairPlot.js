import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { sceneChart } from "./sceneChart.js";

/**
 * Reusable 3D Crosshair Plot (Experimental) Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.crosshairPlot();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @param {number} width - X3D canvas width in px.
 * @param {number} height - X3D canvas height in px.
 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
 * @param {d3.scale} xScale - D3 scale.
 * @param {d3.scale} yScale - D3 scale.
 * @param {d3.scale} zScale - D3 scale.
 * @param {boolean} debug - Show debug log and stats. True/False.
 */
export default function() {
	return sceneChart({
		classed: "d3X3dCrosshairPlot",
		layers: ["axis", "crosshairs"],
		state: {
			width: 500,
			height: 500,
			dimensions: { x: 40, y: 40, z: 40 },
			debug: false,
			xScale: undefined,
			yScale: undefined,
			zScale: undefined
		},
		axis: () => component.axisThreePlane(),
		mark: () => component.crosshair(),
		init(data, chartState) {
			const { coordinatesMax } = dataTransform(data).summary();
			const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
			const { x: dimensionX, y: dimensionY, z: dimensionZ } = chartState.dimensions;

			chartState.xScale = d3.scaleLinear()
				.domain([0, maxX])
				.range([0, dimensionX]);

			chartState.yScale = d3.scaleLinear()
				.domain([0, maxY])
				.range([0, dimensionY]);

			chartState.zScale = d3.scaleLinear()
				.domain([0, maxZ])
				.range([0, dimensionZ]);
		},
		configureAxis(axis, chartState) {
			axis.dimensions(chartState.dimensions);
		},
		draw({ scene, mark, data }) {
			let crosshairs = scene.select(".crosshairs")
				.datum(data)
				.selectAll(".crosshair")
				.data((d) => d.values);

			crosshairs.enter()
				.append("group")
				.classed("crosshair", true)
				.merge(crosshairs)
				.transition()
				.each(function() {
					d3.select(this).call(mark);
				});
		}
	});
}
