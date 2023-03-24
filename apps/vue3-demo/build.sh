#! /bin/bash shell
set -ex

rm -rf ./build
npm i -g pnpm@7
pnpm --filter open-marketing install
pnpm run build
echo "build successful!"