#!/bin/bash

CWD=`pwd`;
LOCALDIR="$CWD/linux-unpacked/public/.local";
DATADIR=`dirname $CWD`
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
	docker stop geth_stunnel_rinkeby && exit 0; 
}

function dockerIP() { 
	echo `docker inspect geth_stunnel_rinkeby|grep -w IPAddress -m1|grep -oE [0-9.]+`;
}

function createStunnel() {
	IP=`dockerIP`
	ssh -i ~/.ssh/11be_ecdsa -L 8545:localhost:8545 -N -f -l eleven ${IP};
}

function sshkeys() {
	mkdir -p ${HOME}/.ssh ${DATADIR}/.ssh && chmod 700 ${HOME}/.ssh ${DATADIR}/.ssh && \
	ssh-keygen -t ecdsa -q -f ${HOME}/.ssh/11be_ecdsa -N '' && \
	cp -f ${HOME}/.ssh/11be_ecdsa.pub ${DATADIR}/.ssh/authorized_keys && \
	chmod 600 ${HOME}/.ssh/* ${DATADIR}/.ssh/* && \
	chmod 700 ${DATADIR}
}

function sshFP() {
	IP=`dockerIP`
	ssh-keygen -R $IP && \
	ssh-keyscan -t ecdsa $IP >> $HOME/.ssh/known_hosts;
}

function dockerSetup() {
	docker pull docker.io/infwonder/geth_stunnel_rinkeby_les2 && \
	docker run --rm -t -v"${DATADIR}:/data:z" \
		--entrypoint "/usr/bin/start.sh" \
		docker.io/infwonder/geth_stunnel_rinkeby_les2 INIT && \
	sshkeys && \
        docker run --name geth_stunnel_rinkeby \
	        -p 30303:30303 -p 30303:30303/udp -p 30304:30304/udp \
		-td -v"${DATADIR}:/data:z" \
		--entrypoint "/usr/bin/start.sh" \
		docker.io/infwonder/geth_stunnel_rinkeby_les2 START && \
	sshFP
}

function dockerInit() {
	IN=`docker ps -f NAME="geth_stunnel_rinkeby" -q|wc -l`
	if [ $IN -eq 0 ]; then
		docker start geth_stunnel_rinkeby 2> /dev/null || dockerSetup;
	fi
}

function startUI() {
	sleep 3 && \
	cd ./linux-unpacked && \
	./cast-iron-app
}

# Main
dockerInit && \
createStunnel && \
startUI && \
blocking;
