#!/bin/bash

ROUND=0;

function blocking() {
	#echo "Please type \"RUN\" to launch CastIron Wallet, or";
	#echo "Please type \"END\" to terminate geth docker container.";
	#read -p "[Your Choice]: " ANS;
	ANS=`jq .configDir ./linux-unpacked/public/.local/bootstrap_config.json`;
	[ $ROUND -eq 0 ] && startUI || [ $ANS != '' ] && shutdown || blocking;
}

function shutdown() { docker stop geth_stunnel; }

function dockerIP() { 
	IP=`docker inspect geth_stunnel|grep -w IPAddress -m1|grep -oE [0-9.]+`;
	ssh -L 8545:localhost:8545 -N -f -l eleven ${IP};
}

function dockerInit() {
	docker start geth_stunnel || \
	docker run --name geth_stunnel -td -v"/home/jasonlin/tmp:/data:z" geth_stunnel
}

function startUI() {
	ROUND=$(($ROUND+1));
	cd ./linux-unpacked && \
	./cast-iron-app
}

# Main
dockerInit && \
dockerIP && \
blocking	
