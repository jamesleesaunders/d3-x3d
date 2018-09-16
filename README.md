# d3-x3d
## D3 X3DOM Data Visualisation Library

[![npm version](https://badge.fury.io/js/d3-x3d.svg)](https://badge.fury.io/js/d3-x3d)
[![Build Status](https://travis-ci.org/jamesleesaunders/d3-x3d.svg?branch=master)](https://travis-ci.org/jamesleesaunders/d3-x3d)
[![Known Vulnerabilities](https://snyk.io/test/github/jamesleesaunders/d3-x3d/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jamesleesaunders/d3-x3d?targetFile=package.json)

Combining the power the [D3.js](http://www.d3js.org/) data-driven documents visualisation library and the [X3DOM](https://github.com/x3dom/x3dom) declarative 3D DOM framework, **d3-x3d** makes it easy to quickly produce beautiful 3D data visualisations with minimal code.

Inspired by Mike Bostock's [reusable charts](http://bost.ocks.org/mike/chart/), **d3-x3d** is built on a foundation of building blocks, called components, which can be combined to create a variety of different data visualisations.

### Getting Started

Include D3.js, X3DOM and d3-x3d script and style files in the `<head>` section of your page:

```html
<head>
   <script src="https://d3js.org/d3.v5.min.js"></script>   
   <script src="https://x3dom.org/download/dev/x3dom-full.js"></script>
   <link rel="stylesheet" href="https://x3dom.org/download/dev/x3dom.css" />
   <script src="d3-x3d.js"></script>
</head>

```

Add a chartholder `<div>` and `<script>` tags to your page `<body>`:
```html
<body>
   <div id="chartholder"></div>
   <script></script>
</body>
```

Place the following code between the `<script>` section of your page:

Declare the [chart](#charts-and-components):
```javascript
var myChart = d3.x3d.chart.barChart();
```

Generate some [data](#data-structure):
```javascript
var myData = {
	"key": "Fruit",
	"values": [
		{"key": "Apples", "value": 9},
		{"key": "Oranges", "value": 3},
		{"key": "Grapes", "value": 5},
		{"key": "Bananas", "value": 7}
	]
};
```

Attach `x3d`, `scene` and `viewpoint` to the chartholder div:
```javascript
var x3d = d3.select("#chartholder")
	.append("x3d")
	.attr("width", "500px")
	.attr("height", "500px");

var scene = x3d.append("scene");

scene.append("viewpoint")
	.attr("position", "80.0 15.0 80.0")
	.attr("orientation", "0.0 1.0 0.0 0.8")
	.attr("fieldOfView", "0.8")
	.attr("set_bind", "true");
```

Attach data and chart to scene:
```javascript
scene.append("group")
	.attr("class", "chart")
	.datum(myData)
	.call(myChart);
```

### Charts and Components

**d3-x3d** have two levels component: `charts` and `components`:

`components` are the lower level building blocks which, when combined, can be used to build a chart. For example by combining the `bubbles` and `axis` components together we can create a scatter plot chart:

| Component                       | Description   |
| ------------------------------- | ------------- |
| d3.x3d.component.axis()         |               |
| d3.x3d.component.axisMulti()    |               |
| d3.x3d.component.bars()         |               |
| d3.x3d.component.barsMulti()    |               |
| d3.x3d.component.bubbles()      |               |
| d3.x3d.component.bubblesMulti() |               |
| d3.x3d.component.surface()      |               |

`charts` are higher level, pre-combned components, which makes it easier to quickly create a chart:

| Component                       | Description   |
| ------------------------------- | ------------- |
| d3.x3d.chart.barChart()         |               |
| d3.x3d.chart.scatterPlot()      |               | 
| d3.x3d.chart.surfaceArea()      |               |

### Data Structure

The format of the d3-x3d data must be in key / value pairs.

### Credits

* Fabian Dubois <http://bl.ocks.org/fabid/61cbfe14de686cc25c47/>
* Fabian Dubois <https://github.com/fabid/d3-x3dom-shape>
* David Sankel <http://bl.ocks.org/camio/5087116>
