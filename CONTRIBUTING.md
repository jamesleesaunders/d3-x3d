# d3-x3d
## Contributing Guidelines

**d3-x3d** makes it easy to quickly produce beautiful 3D data visualisations with minimal code.

The `dist/d3-x3d.js` and `dist/d3-x3d.css` files are built from source files in the `src` directory.
Do NOT edit the `dist` files directly, but rather edit the `src` files and then run `make` or `npm test` to generate the `dist` files.

## Unit Testing
Note, d3-x3d is currently transitioning unit testing framework from the tape to mocha. Currently running with a combination of the two. All new unit tests should be written using mocha. In time all tape tests should be re-written in mocha.

## Code Styles

To ensure code formatting is kept standard, IDE configuration files for PHPStorm and Atom can be found in the `config` directory.
If contributing to d3-x3d please ensure code formatting is maintained as per these standards.

* Atom Beautify Config
  * Copy `config/Atom_Beautify_Confg.json` to a file called `.jsbeautifyrc` in the project root.
  * Also See: https://atom.io/packages/atom-beautify#configuration

* WebStorm Config
  * In WebStorm, select `Preferences` -> `Editor` -> `Code Styles` -> `JavaScript` -> `Scheme` -> `Import Scheme` -> `config/WebStorm_CodeStyle_Scheme.xml`
  * Also See: https://www.jetbrains.com/help/webstorm/copying-code-style-settings.html

* EditorConfig
  * There is also a .editorconfig file. EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs.
  * Also See: https://editorconfig.org/

Please feel free to contribute code style configuration files for other popular IDEs.
