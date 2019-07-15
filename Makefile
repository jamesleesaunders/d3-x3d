# d3-x3dom Makefile

COMPRESS_FILES := dist/d3-x3dom.js \
                  dist/d3-x3dom.min.js \
                  README.md \
                  LICENSE.md

all: js css min zip docs
.PHONY: js css min zip docs

js:
	@echo Compiling JS Files...
	@rm -f dist/d3-x3dom.js
	@./node_modules/rollup/bin/rollup -c config/rollup.config.js

min:
	@echo Minifying...
	@rm -f dist/d3-x3dom.min.js
	@./node_modules/uglify-es/bin/uglifyjs dist/d3-x3dom.js > dist/d3-x3dom.min.js

zip: $(COMPRESS_FILES)
	@echo Zipping...
	@rm -f dist/d3-x3dom.zip
	@zip -qj dist/d3-x3dom.zip $^

docs:
	@echo Generating Docs...
	@rm -rf docs
	@node ./node_modules/jsdoc/jsdoc.js -c config/jsdoc.conf.json
