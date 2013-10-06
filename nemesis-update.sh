#!/bin/bash
#
# Nemesis Updater (nemesis-update)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#
[ "$(whoami)" != "root" ] && echo "This script must be run as root." && exit 1

echo "Updating broker.nemesiscloud.com"
cd /var/www/broker.nemesiscloud.com
git pull broker master

echo "Updating cipher.nemesiscloud.com"
cd /var/www/cipher.nemesiscloud.com
git pull cipher master

echo "Updating keys.nemesiscloud.com"
cd /var/www/keys.nemesiscloud.com
git pull cipher master

echo "Updating audit.nemesiscloud.com"
cd /var/www/audit.nemesiscloud.com
git pull audit master

echo "done."
exit 0
