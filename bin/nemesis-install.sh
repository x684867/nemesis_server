#!/bin/bash
#
# nemesis-install.sh
# (c) 2013 Sam caldwell.  All Rights Reserved.
#
ntpdate 0.pool.ntp.org
apt-get install vim -y && \
apt-get install openssh-server openssh-client -y && \
apt-get install nginx-full -y 
