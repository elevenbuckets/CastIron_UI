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
            blockTime : null
        }
        //this.initialize();
    }

    initialize = () => {
        let netStatus = this.wallet.ethNetStatus();
        this.state.blockHeight = netStatus.blockHeight;
        this.state.blockTime = netStatus.blockTime;
	this.state.highestBlock = netStatus.highestBlock;
        this.timer = setInterval(this.watchAndNotify, 1000);

        this.register(this.reportNewBlock);
    }

    watchAndNotify = () =>{
        let netStatus = this.wallet.ethNetStatus();
        if (this.state.highestBlock == this.state.blockHeight && netStatus.blockHeight != this.state.blockHeight) {
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
