#!/bin/bash

set -u
set -e

docker build -t softvisio/node:latest --no-cache --pull .

docker push softvisio/node:latest
