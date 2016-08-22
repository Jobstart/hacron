PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.FORCE:

all: clean .FORCE
	babel src -d lib
	npm shrinkwrap --production
	docker build -t jobstartinc/hacron:$(tag) .

clean: .FORCE
	rimraf lib

test: .FORCE
	DEBUG=hacron:test:* mocha

lint: .FORCE
	eslint src
	eslint test

publish: .FORCE
	docker push jobstartinc/hacron:$(tag)

development: .FORCE
	nodemon ./dev.js
