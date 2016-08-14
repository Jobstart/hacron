PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.FORCE:

all: .FORCE
	babel src -d lib

clean:
	rimraf lib

unit: .FORCE
	mocha test/unit

integration: .FORCE
	docker-compose up -d
	mocha test/integration
	docker-compose stop || echo 'failed to bring down containers'
	docker-compose rm -f || echo 'failed to remove containers'

lint: .FORCE
	eslint src
	eslint test

image:
	docker build -t jobstartinc/hacron$(tag) .

publish: .FORCE
	docker push jobstartinc/hacron:$(tag)

development: .FORCE
	nodemon ./dev.js
