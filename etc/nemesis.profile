#!/bin/bash
#/etc/profile.d/nemesis.profile
#(c) 2013 Sam Caldwell.  All Rights Reserved.
#
[ "$(echo $PATH | grep -o \/srv\/nemesis\/bin | wc -l)" == "0" ] && {
	export PATH=$PATH:/srv/nemesis/bin/
}