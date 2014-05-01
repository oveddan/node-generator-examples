NODE ?= node

test:
	@$(NODE) ./node_modules/.bin/mocha \
		--require chai \
		--reporter spec \
		--slow 2s \
		--harmony-generators \
		--bail

.PHONY: test