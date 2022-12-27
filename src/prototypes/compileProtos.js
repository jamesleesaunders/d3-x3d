/**
 * Generate JSON file of compiled X3D Prototypes, encoded as base64 data URLs.
 */

import * as fs from 'fs';

let protoFolder = "./src/prototypes/";
let protoFiles = {
	torus: "TorusPrototype.x3d"
};
let outputFile = `${protoFolder}prototypes.json`

let prototypes = Object.entries(protoFiles).reduce(function(protos, file) {
	let name = file[0];
	let fileEncoded = fs.readFileSync(`${protoFolder}${file[1]}`, 'base64');
	protos[name] = `data:model/x3d+xml;charset=utf-8;base64,${fileEncoded}`;
	return protos;
}, {});

let data = JSON.stringify(prototypes, null, 2);
fs.writeFileSync(outputFile, data);
