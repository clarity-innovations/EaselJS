SRC_DIR ?= ../src
DIST_DIR ?= ../lib
DIST_NAME ?= uglifyjs.min.js

identify:
	@echo 'SRC_DIR = $(SRC_DIR)'
	@echo 'DIST_DIR = $(DIST_DIR)'

# list-src:
	## Ideally build from source.
	# @find ../src -name '*.js'
list-src:
	@echo $(DIST_DIR)/easeljs.js

build:
	make build-uglifyjs

build-uglifyjs:
	# Making build (using uglifyjs)...
	bash -c 'node_modules/uglify-js/bin/uglifyjs `make list-src` --output $(DIST_DIR)/$(DIST_NAME)'
	# Build complete.
