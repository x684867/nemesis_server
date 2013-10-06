#!/bin/bash
#
# Nemesis Updater (nemesis-update)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#
[ "$(whoami)" != "root" ] && echo "This script must be run as root." && exit 1

echo "Updating broker.nemesiscloud.com"
cd /var/www/
git pull nemesis_server master
