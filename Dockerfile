FROM centos:latest

LABEL maintainer="zdm"

USER root

ENV NODE_WORKSPACE="/var/local/node-workspace" \
    NODE_BUILD_DIR="/var/local/node-build"

ADD . /var/local/softvisio-vue-ext

WORKDIR /var/local/softvisio-vue-ext/bin/docker

RUN \
    mkdir -p $NODE_WORKSPACE \
    && mkdir -p $NODE_BUILD_DIR \
    && chmod +x init.sh \
    && ./init.sh

ENTRYPOINT [ "/bin/bash", "-l" ]

ONBUILD WORKDIR $NODE_BUILD_DIR
ONBUILD ADD . $NODE_BUILD_DIR
ONBUILD RUN yarn-update
