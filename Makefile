PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.FORCE:

all: .FORCE
	babel src -d lib
	npm shrinkwrap --production
	docker build -t jobstartinc/hacron:$(tag) .

clean:
	rimraf lib

test: .FORCE
	docker-compose up -d
	docker-compose scale hacron=3
	mocha
	docker-compose stop || echo 'failed to bring down containers'
	docker-compose rm -f || echo 'failed to remove containers'

lint: .FORCE
	eslint src
	eslint test

publish: .FORCE
	docker push jobstartinc/hacron:$(tag)

development: .FORCE
	nodemon ./dev.js
