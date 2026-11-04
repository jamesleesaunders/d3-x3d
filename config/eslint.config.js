import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const eslintrc = JSON.parse(readFileSync(path.join(configDir, ".eslintrc.json"), "utf8"));
const compat = new FlatCompat({
	baseDirectory: configDir,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default compat.config(eslintrc);
