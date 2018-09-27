#!/bin/bash

CWD=`pwd`;
LOCALDIR="$CWD/linux-unpacked/public/.local";
DATADIR=`dirname $(dirname $CWD)`
ANS=`jq .configDir $LOCALDIR/bootstrap_config.json`;

# let nothing be really nothing
if [ $ANS == '""' ]; then
       	ANS='';
	echo "Initialization expected, auto container termination disabled.";
fi

function blocking() {
	NewANS=`jq .configDir $LOCALDIR/bootstrap_config.json`;
	[ "$ANS" != "$NewANS" ] && holding || shutdown;
}

function holding() {
	echo "Please press \"Enter\" to terminate geth container ..."
	read ANS;
	shutdown;
}

function shutdown() { 
	echo "Shutting down, please wait ...";
	docker stop geth_stunnel && exit 0; 
}


function dockerIP() { 
	IP=`docker inspect geth_stunnel|grep -w IPAddress -m1|grep -oE [0-9.]+`;
	ssh -L 8545:localhost:8545 -N -f -l eleven ${IP};
}

function dockerInit() {
	docker start geth_stunnel || \
	docker run --name geth_stunnel -td -v"${DATADIR}:/data:z" geth_stunnel
}

function startUI() {
	cd ./linux-unpacked && \
	./cast-iron-app
}

# Main
dockerInit && \
dockerIP && \
startUI && \
blocking;
