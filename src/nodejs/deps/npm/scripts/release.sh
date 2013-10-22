#!/bin/bash

# script for creating a zip and tarball for inclusion in node

unset CDPATH

set -e

rm -rf release *.tgz || true
mkdir release
npm pack --loglevel error >/dev/null
mv *.tgz release
cd release
tar xzf *.tgz

mkdir node_packages
mv package node_packages/npm

# make the zip for windows users
cp node_packages/npm/bin/*.cmd .
zipname=npm-$(npm -v).zip
zip -q -9 -r -X "$zipname" *.cmd node_packages

# make the tar for node's deps
cd node_packages
tarname=npm-$(npm -v).tgz
tar czf "$tarname" npm

cd ..
mv "node_packages/$tarname" .

rm -rf *.cmd
rm -rf node_packages

echo "release/$tarname"
echo "release/$zipname"
