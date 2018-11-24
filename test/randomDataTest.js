let test = require("tape");
let d3X3dom = require("../");

test("Test Random Data Generation", function(t) {
	let randomData = d3X3dom.randomData;

	let countries = ["UK", "France", "Spain", "Germany", "Italy", "Portugal"];
	t.deepEqual(randomData.countries, countries, "Test Stores");

	let fruit = ["Apples", "Oranges", "Pears", "Bananas"];
	t.deepEqual(randomData.fruit, fruit, "Test Fruit");

	let data = randomData.dataset1();
	let keys = Object.keys(data);
	t.deepEqual(keys, ["key", "values"], "Test Random Dataset 1 Keys");
	let key = Object.keys(data.key);
	t.deepEqual(key, ["0", "1", "2", "3", "4"], "Test Random Dataset 1 Key");
	let values = Object.keys(data.values);
	t.deepEqual(values, ["0", "1", "2", "3"], "Test Random Dataset 1 Values");

	t.end();
});
