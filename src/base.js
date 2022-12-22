import * as d3 from "d3";

/**
 * Construct base X3D element
 *
 * @module
 */
function buildX3d(selection, width, height, debug) {
	// Create X3D element (if it does not exist already)
	// See: https://www.web3d.org/x3d/profiles
	let x3d = selection.selectAll("X3D")
		.data([0])
		.enter()
		.append("X3D")
		.attr("profile", "Interactive")
		.attr("width", width + "px")
		.attr("height", height + "px")
		.attr("showLog", debug ? "true" : "false")
		.attr("showStat", debug ? "true" : "false")
		.attr("useGeoCache", false);

	x3d.append("head")
		.append("component")
		.attr("name", "Text")
		.attr("level", "1");

	return x3d;
}

/**
 * Construct base Scene elements
 *
 * @module
 */
function buildScene(x3d, layers, classed) {
	// Create Scene
	let scene = x3d.selectAll("Scene")
		.data([0])
		.enter()
		.append("Scene");

	if (typeof x3dom !== "undefined") {
		// Gamma correction only works on x3dom.
		scene.append("Environment")
			.attr("gammaCorrectionDefault", "none");
	} else {
		// Load Torus prototype in X_ITE.
		scene.html(`<ExternProtoDeclare name='Torus' url='"https://raw.githubusercontent.com/jamesleesaunders/d3-x3d/TorusProto/examples/scratch/TorusPrototype.x3d"'>
        <field accessType='inputOutput' type='SFFloat' name='angle' value='6.28318530718'></field>
        <field accessType='inputOutput' type='SFFloat' name='innerRadius' value='0.5'></field>
        <field accessType='inputOutput' type='SFFloat' name='outerRadius' value='1.0'></field>
        <field accessType='inputOutput' type='SFVec2f' name='subdivision' value='24,24'></field>
        <field accessType='initializeOnly' type='SFBool' name='caps' value='true'></field>
        <field accessType='initializeOnly' type='SFBool' name='solid' value='true'></field>
      </ExternProtoDeclare>`);
	}

	// Add a white background
	scene.append("Background")
		.attr("groundColor", "1 1 1")
		.attr("skyColor", "1 1 1");

	// Add layer groups
	scene.classed(classed, true)
		.selectAll("Group")
		.data(layers)
		.enter()
		.append("Group")
		.attr("class", (d) => d);

	return scene;
}

/**
 * Reusable X3D Base and Scene Component
 *
 * @module
 */
export function createScene(selection, layers, classed, width, height, debug) {
	let x3d = buildX3d(selection, width, height, debug);
	let scene = buildScene(x3d, layers, classed);
	// For some reason we need to re-select the scene after building it to allow for charts to refresh.
	// Example: /examples/X3DOM/chart/BarChartMultiSeries.html adding additional series to chart does not
	// refresh without the line below.
	scene = selection.select("Scene");
	return scene;
}
