import component from "../component.js";
import { sceneChart, initCoordinateScales } from "./sceneChart.js";

/**
 * Reusable 3D Spot Plot
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.spotPlot();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/bubble-chart/
 *
 * @param {number} width - X3D canvas width in px.
 * @param {number} height - X3D canvas height in px.
 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
 * @param {d3.scale} xScale - D3 scale.
 * @param {d3.scale} yScale - D3 scale.
 * @param {d3.scale} zScale - D3 scale.
 * @param {d3.scale} colorScale - D3 color scale.
 * @param {Array} colors - Array of colours used by color scale.
 * @param {d3.scale} sizeScale - D3 color scale.
 * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
 * @param {boolean} debug - Show debug log and stats. True/False.
 */
export default function() {
	return sceneChart({
		classed: "d3X3dSpotPlot",
		layers: ["axis", "spots"],
		markLayer: ".spots",
		state: {
			width: 500,
			height: 500,
			dimensions: { x: 40, y: 40, z: 40 },
			colors: ["green", "red", "yellow", "steelblue", "orange"],
			sizeRange: [0.5, 3.5],
			debug: false,
			xScale: undefined,
			yScale: undefined,
			zScale: undefined,
			colorScale: undefined,
			sizeScale: undefined
		},
		axis: () => component.axisThreePlane(),
		mark: () => component.spotsMultiSeries(),
		init: initCoordinateScales,
		configureMark(mark, chartState) {
			mark.sizeScale(chartState.sizeScale)
				.colorScale(chartState.colorScale);
		}
	});
}
