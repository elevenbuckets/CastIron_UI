import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import React, { Component } from 'react';
import BlockTimer from './BlockTimer'

class Scheduler {

    constructor(){
        this.state = {
            Qs : []
        }

        BlockTimer.register(this.runJobs)
    }

  

    runJobs =  () =>{
        this.state.Qs.map(queue =>{
            if(this.isReadyToRun(BlockTimer.state.blockHeight, BlockTimer.state.blockTime, queue)){
                queue.func(...queue.args);
                queue.status = "Executed";
            }
        })
    }


    schedule = (queue) =>{
        this.state.Qs.push(queue);
    }

    deleteQ = (Q) =>{
        if(this.state.Qs.indexOf(Q) != -1){
            this.state.Qs.splice(this.state.Qs.indexOf(Q), 1);
        }
    }

    deleteQs = (Qs) =>{
        Qs.map(Q => {
            this.deleteQ(Q);
        })
    }

    isReadyToRun = (blockHeight, blockTime, queue) =>{
        if(queue.status == "Executed"){
            return false;
        }else if(queue.trigger == "BlockHeight"){
            return blockHeight >= parseInt(queue.target) && blockHeight <= (parseInt(queue.target) + parseInt(queue.tolerance));
        }else if (queue.trigger == "BlockTime"){
            return blockTime >= queue.target && blockTime <= (queue.target + queue.tolerance);
        }
    }

}

const scheduler = new Scheduler()

export default scheduler;
