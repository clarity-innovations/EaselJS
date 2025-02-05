SRC_DIR ?= ../src
DIST_DIR ?= ../lib
DIST_NAME ?= easeljs
NEXT_DIST_NAME ?= easeljs-NEXT
DIST_EXT ?= .min.js

identify:
	@echo 'SRC_DIR = $(SRC_DIR)'
	@echo 'DIST_DIR = $(DIST_DIR)'

# list-src:
	## Ideally build from source.
	# @find ../src -name '*.js'
list-src:
	@echo $(DIST_DIR)/easeljs.js

list-next-src:
	@echo $(DIST_DIR)/easeljs-NEXT.js

build:
	# Making build...
	bash -c 'node_modules/uglify-js/bin/uglifyjs `make list-src` --output $(DIST_DIR)/$(DIST_NAME)$(DIST_EXT)'
	# Build complete.

build-next:
	# Making NEXT build...
	bash -c 'node_modules/uglify-js/bin/uglifyjs `make list-next-src` --output $(DIST_DIR)/$(DIST_NAME)$(DIST_EXT)'
	# Build complete.
