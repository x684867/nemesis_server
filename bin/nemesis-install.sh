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

echo "Starting install ( $1 )..."
case "$1" in 
	base)
		echo "set tabstop=4" > /root/.vimrc
		echo "Updating the clock..."
		time ntpdate 0.pool.ntp.org && \
		echo "installing software packages" && \
		apt-get install vim -y && \
		apt-get install openssh-server openssh-client -y && \
		apt-get install nginx-full -y && \
		apt-get install nodejs -y && \
		apt-get install npm -y && \
		echo "software is now installed...configuring system." && \
		rm -f /etc/nginx/sites-enabled/* && \
		rm -rf /etc/nginx/sites-available && \
		ln -s /srv/nemesis/etc/nginx/sites-available /etc/nginx/sites-available && \
		ln -s /srv/nemesis/etc/nginx/sites-enabled/$2 /etc/nginx/sites-enabled/$2 && \
		ln -s /srv/nemesis/etc/init/$2 /etc/init/$2 && \
		echo "Base installation complete for $2" && \
		exit 0			
	;;
	audit)
		$0 base $1 && \
		exit 0 
	;;
	cipher)
		$0 base $1 && \
		exit 0
	;;
	broker)
		$0 base $1 && \
		exit 0
	;;
	keys)
		$0 base $1 && \
		exit 0
	;;
	*)
		echo "USAGE: $0 [base,broker,cipher,keys]"
		exit 1
	;;
esac
