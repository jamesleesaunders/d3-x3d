/**
 * Reusable X3D Base and Scene Component
 *
 * @module
 */
export default function() {

	const createX3d = (selection, width, height, debug) => {
		// Create X3D element (if it does not exist already)
		let x3d = selection.selectAll("X3D")
			.data([0])
			.enter()
			.append("X3D")
			.attr("width", width + "px")
			.attr("height", height + "px")
			.attr("showLog", debug ? "true" : "false")
			.attr("showStat", debug ? "true" : "false")
			.attr("useGeoCache", false);

		return x3d;
	};


	const createScene2 = (x3d, layers, classed) => {
		// Create Scene
		let scene = x3d.append("Scene");

		// Disable gamma correction
		scene.append("Environment")
			.attr("gammaCorrectionDefault", "none");

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

		return x3d.select("Scene");
	};

	const createScene = (selection, layers, classed, width, height, debug) => {
		let x3d = createX3d(selection, width, height, debug);
		let scene = createScene2(x3d, layers, classed);

		return scene;
	};

	return createScene;
}

