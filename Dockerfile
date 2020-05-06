FROM softvisio/pcore:latest

LABEL maintainer="zdm"

USER root

ENV DIST_PATH="$WORKSPACE/node"

ADD . $DIST_PATH

WORKDIR $DIST_PATH

RUN chmod +x init.sh && ./init.sh

ONBUILD ADD . /var/local/build
ONBUILD RUN yarn-update

ENTRYPOINT [ "/bin/bash", "-l" ]
