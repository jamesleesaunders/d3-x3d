# d3-x3dom Makefile

GENERATED_FILES := build/d3-x3dom.js \
                   build/d3-x3dom.min.js \
                   README.md \
                   LICENSE.md

all: js css min zip
.PHONY: js css min zip

js:
	@echo Compiling JS Files...
	@rm -f build/d3-x3dom.js
	@rollup -c config/rollup.config.js

min:
	@echo Minifying...
	@rm -f build/d3-x3dom.min.js
	@uglifyjs build/d3-x3dom.js > build/d3-x3dom.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f build/d3-x3dom.zip
	@zip -qj build/d3-x3dom.zip $^
