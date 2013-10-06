#!/bin/bash
#
# nemesis-install.sh
# (c) 2013 Sam caldwell.  All Rights Reserved.
#
[ "$(whoami)" != "root" ] && echo "$0 must be run as root." && exit 1
[ -z "$1" ] && {
	echo "Missing argument."
	echo " "
	echo "Expected $0 [base,broker,cipher,keys."
	exit 1
}

case "$1" in 
	base)
		echo "set tabstop=4" > /root/.vimrc
		ntpdate 0.pool.ntp.org
		apt-get install vim -y && \
		apt-get install openssh-server openssh-client -y && \
		apt-get install nginx-full -y && \
		apt-get install nodejs -y && \
		apt-get install npm -y && \
		echo "Base install completed."
	;;
	cipher)
		$0 base
		echo "cipher not implemented"
	;;
	broker) 
		$0 base
		echo "broker not implemented"
	;;
	keys)
		$0 base
		echo "keys not implemented"
	;;
	*)
		echo "USAGE: $0 [base,broker,cipher,keys]"
		exit 1
	;;
esac
