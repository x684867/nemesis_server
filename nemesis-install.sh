#!/bin/bash
#
# nemesis-install.sh
# (c) 2013 Sam caldwell.  All Rights Reserved.
#
ntpdate 0.pool.ntp.org
apt-get install vim -y && \
apt-get install openssh-server openssh-client -y && \
apt-get install build-essential -y && \
apt-get install python-dev -y && \
apt-get install python-pip -y && \
apt-get install nginx-full -y && \
apt-get install uwsgi -y && \
apt-get install uwsgi-plugin-python -y && \
apt-get install libyaml -y && \
apt-get install python-virtualenv -y && \
echo " "
echo "PIP Packages"
echo " "
pip install flask && \
pip install virtualenv

virtualenv /var/www/broker.nemesiscloud.com/uwsgi
