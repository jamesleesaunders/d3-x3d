# d3-x3d Makefile

CSS_FILES :=       css/global.css

GENERATED_FILES := build/d3-x3d.js \
                   build/d3-x3d.min.js \
                   build/d3-x3d.css \
                   README.md \
                   LICENSE.md

all: js css min zip
.PHONY: js css min zip

js:
	@echo Compiling JS Files...
	@rm -f build/d3-x3d.js
	@rollup -c

css: $(CSS_FILES)
	@echo Concatenating CSS Files...
	@rm -f build/d3-x3d.css
	@for file in $^; do cat "$$file"; echo "\n"; done > build/d3-x3d.css

min:
	@echo Minifying...
	@rm -f build/d3-x3d.min.js
	@uglifyjs build/d3-x3d.js > build/d3-x3d.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f build/d3-x3d.zip
	@zip -qj build/d3-x3d.zip $^
