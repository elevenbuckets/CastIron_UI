import SchedulerView from '../dapp_view/SchedulerView'
import React from 'react';
class DappViewService {
    constructor() {
        this.viewMap = {
            Scheduler: <SchedulerView />
        }
    }

    import(dapp){
       
    }

    getView = key =>{
        return this.viewMap[key];
    } 
}
const dappViewService = new DappViewService();

export default dappViewService;
