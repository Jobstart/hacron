PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.FORCE:

all: clean .FORCE
	eslint src
	flow check
	babel src -d lib
	npm shrinkwrap --production
	docker build -t jobstartinc/hacron:$(tag) .

clean: .FORCE
	rimraf lib

test: .FORCE
	eslint test
	DEBUG=hacron:test:* mocha

development: .FORCE
	nodemon ./dev.js
