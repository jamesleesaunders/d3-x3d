/**
 * Concatenate two arrays and keep the first occurrence of each value.
 *
 * @module
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Array}
 */
export function arrayUnique(array1, array2) {
	const seen = new Set();
	const unique = [];

	array1.concat(array2).forEach((item) => {
		if (!seen.has(item)) {
			seen.add(item);
			unique.push(item);
		}
	});

	return unique;
}
