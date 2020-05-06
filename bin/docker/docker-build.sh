#!/bin/bash

set -u
set -e

docker build -t softvisio/vue-ext:latest --no-cache --pull ../../.

docker push softvisio/vue-ext:latest
