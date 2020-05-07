FROM centos:latest

LABEL maintainer="zdm"

USER root

ENV NODE_WORKSPACE="/var/local/node-workspace" \
    NODE_BUILD_DIR="/var/local/node-build"

ADD . /var/local/softvisio-vue-ext

WORKDIR $NODE_WORKSPACE

SHELL [ "/bin/bash", "-l", "-c" ]

RUN \
    mkdir -p $NODE_WORKSPACE \
    && mkdir -p $NODE_BUILD_DIR \
    && curl -fsSL https://bitbucket.org/softvisio/scripts/raw/master/node-docker/init.sh | /bin/bash -s

ENTRYPOINT [ "/bin/bash", "-l" ]

ONBUILD SHELL [ "/bin/bash", "-l", "-c" ]
ONBUILD WORKDIR $NODE_BUILD_DIR
ONBUILD ADD . $NODE_BUILD_DIR
ONBUILD RUN yarn-update
