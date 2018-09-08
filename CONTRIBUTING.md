# d3-ez
## Contributing Guidelines

**d3-ez** is a library of reusable graphs and charts which use [D3](http://www.d3js.org/).

The `build/d3-ez.js` and `build/d3-ez.css` files are built from source files in the `src` directory.
Do NOT edit the `build` files directly, but rather edit the `src` files and then run `make` or `npm test` to generate the `build` files.

## Code Styles

To ensure **d3-ez** code formatting is kept standard, IDE configuration files for PHPStorm and Atom can be found in the `config` directory. If contributing to **d3-ez** please code formatting is maintained as per these standards.

* Atom Beautify Config
  * Copy `config/Atom_Beautify_Confg.json` to a file called `.jsbeautifyrc` in the project root.
  * Also See: https://atom.io/packages/atom-beautify#configuration

* WebStorm Config
  * In WebStorm, select `Preferences` -> `Editor` -> `Code Styles` -> `JavaScript` -> `Scheme` -> `Import Scheme` -> `config/WebStorm_CodeStyle_Scheme.xml`
  * Also See: https://www.jetbrains.com/help/webstorm/copying-code-style-settings.html

Please feel free to contribute code style configuration files for other popular IDEs.
