# Node.js generator examples

This provides some basic examples of how Node.js generators can be used,
while also describing their functionality through tests.

The main files are:

* test/ - in this directory there are some test-driven examples of how generators can be used,
and what calling generator.next() does
* generators.js - this shows some simple generator examples.
* dns_lookup/ - this folder contains three ways of doing the same task, looking
up the ip address of a domain and writing it to a file.  One way uses vanilla callbacks,
the other, a generator with thunks built from scratch, and the other a generator with thunks
built using [thunkify](https://github.com/visionmedia/node-thunkify),
and the generator run using [co](https://github.com/visionmedia/co).

## Setup

### Make sure you have at least node node v0.11.11 (unstable)

    node -v

The printed version should be 0.11.11 or above.

To download the latest version of node, go to (http://blog.nodejs.org/release/)
and download and install the latest release for your os.  Note that v0.11.11 and
up are unstable releases of Node.

### Install dependencies

    npm install

## Run the tests

    make test

## Run the generators

To run any of these generators, you must start node with the --harmony flag:

    node --harmony

Example of how to run a particular generator:

    ```javascript
    var generators = require('./generators');
    basicGenerator = generators.basic();
    basicGenerator.next();
    basicGenerator.next();
    ```
