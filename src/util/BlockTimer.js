import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import CastIronService from '../service/CastIronService';
import React, { Component } from 'react';

class BlockTimer {

    constructor(){
        this.wallet = CastIronService.wallet;
        this.state = {
            blockHeight : null,
            observers : [],
            blockTime : null,
	    highestBlock : 0,
	    initialized : false 
        }
        //this.initialize();
    }

    initialize = () => {
	if (this.state.initialized) return;

        let netStatus = this.wallet.ethNetStatus();
        this.state.blockHeight = netStatus.blockHeight;
        this.state.blockTime = netStatus.blockTime;
	this.state.highestBlock = netStatus.highestBlock;
        this.timer = setInterval(this.watchAndNotify, 15000);

        this.register(this.reportNewBlock);
	this.state.initialized = true;
    }

    watchAndNotify = () => {
	if (!this.wallet.connected()) {
		CastIronActions.initPlatform();
		clearInterval(this.timer); // if reconnected, CastIronService.updateInfo will call BlockTimer.initialize() again to setup this.timer;
	}

        let netStatus = this.wallet.ethNetStatus();
        if (netStatus.highestBlock != this.state.highestBlock || netStatus.blockHeight != this.state.blockHeight) {
	    this.state.highestBlock = netStatus.highestBlock;
            this.state.blockHeight = netStatus.blockHeight;
            this.state.blockTime = netStatus.blockTime;
            this.notifyObservers()
	}
       
    }

    notifyObservers = () =>{
        this.state.observers.map((observer) => {
            observer();
        })
    }

    register = (observer) =>{
        this.state.observers.push(observer);
    }

    unRegister = (observer) =>{
        if(this.state.observers.indexOf(observer) == -1){
            return;
        }
        this.state.observers.splice(this.state.observers.indexOf(observer), 1);
    }

    reportNewBlock = () =>{
	if (this.state.blockHeight != this.state.highestBlock) {
		console.log(`Block syncing in progress: ${this.state.blockHeight} / ${this.state.highestBlock}`)
	} else {
        	console.log(`Block Height from reportNewBlock is ${this.state.blockHeight}`);
	}
    }

}

const timer = new BlockTimer()

export default timer;
