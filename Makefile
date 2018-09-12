# d3-x3d Makefile

GENERATED_FILES := build/d3-x3d.js \
                   build/d3-x3d.min.js \
                   README.md \
                   LICENSE.md

all: js css min zip
.PHONY: js css min zip

js:
	@echo Compiling JS Files...
	@rm -f build/d3-x3d.js
	@rollup -c

min:
	@echo Minifying...
	@rm -f build/d3-x3d.min.js
	@uglifyjs build/d3-x3d.js > build/d3-x3d.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f build/d3-x3d.zip
	@zip -qj build/d3-x3d.zip $^
