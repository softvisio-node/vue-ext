#!/bin/bash

# curl -fsSL https://bitbucket.org/softvisio/node/raw/master/yarn-build > /usr/local/bin/yarn-build && chmod +x /usr/local/bin/yarn-build
# curl -fsSL https://bitbucket.org/softvisio/node/raw/master/yarn-install > /usr/local/bin/yarn-install && chmod +x /usr/local/bin/yarn-install
# curl -fsSL https://bitbucket.org/softvisio/node/raw/master/yarn-relink > /usr/local/bin/yarn-relink && chmod +x /usr/local/bin/yarn-relink
# curl -fsSL https://bitbucket.org/softvisio/node/raw/master/yarn-unlink > /usr/local/bin/yarn-unlink && chmod +x /usr/local/bin/yarn-unlink
# curl -fsSL https://bitbucket.org/softvisio/node/raw/master/yarn-update > /usr/local/bin/yarn-update && chmod +x /usr/local/bin/yarn-update

set -u
set -e

# install commands
chmod +x yarn-build && cp yarn-build /usr/local/bin
chmod +x yarn-install && cp yarn-install /usr/local/bin
chmod +x yarn-relink && cp yarn-relink /usr/local/bin
chmod +x yarn-unlink && cp yarn-unlink /usr/local/bin
chmod +x yarn-update && cp yarn-update /usr/local/bin

dnf -y install git

# setup node
n latest

curl -fsSL https://bitbucket.org/softvisio/scripts/raw/master/setup-node.sh | /bin/bash

node --version
yarn --version

cat <<EOF > ~/.yarnrc.yml
defaultSemverRangePrefix: '>='
enableTimers: false
enableGlobalCache: true
globalFolder: '.yarn/global'
pnpUnpluggedFolder: '.yarn/unplugged'
yarnPath: '.yarn/releases/yarn-berry.js'
checksumBehavior: 'ignore'
EOF

# fill yarn cache
yarn

mkdir -p workspace
pushd workspace

# pre-install @softvisio/core
git clone https://bitbucket.org/softvisio/softvisio-core.git
pushd softvisio-core
yarn-unlink
yarn install
popd

# pre-install @softvisio/ext
git clone https://bitbucket.org/softvisio/softvisio-ext.git
pushd softvisio-ext
yarn-unlink
yarn install
popd

# pre-install @softvisio/vue
git clone https://bitbucket.org/softvisio/softvisio-vue.git
pushd softvisio-vue
yarn-unlink
yarn install
popd

# pre-install @softvisio/vue-ext
git clone https://bitbucket.org/softvisio/softvisio-vue-ext.git
pushd softvisio-vue-ext
yarn-unlink
yarn install
popd
