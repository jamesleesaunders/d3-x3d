import dataTransform from "./dataTransform.js";

/**
 * Summarise one column for each mapped dimension.
 *
 * @module
 * @param {Object} data - Series whose values carry `{ key, value }` pairs.
 * @param {Object} mappings - Dimension name to value key.
 * @param {string[]} keys - Dimensions to summarise, such as "x" or "color".
 * @returns {Object} A dataTransform summary for each key.
 */
export function extentsFromMappings(data, mappings, keys) {
	const summaries = {};

	keys.forEach((dimension) => {
		const set = {
			key: dimension,
			values: []
		};

		data.values.forEach((d) => {
			const key = mappings[dimension];
			const value = d.values.find((v) => v.key === key).value;
			set.values.push({ key: key, value: value });
		});

		summaries[dimension] = dataTransform(set).summary();
	});

	return summaries;
}
