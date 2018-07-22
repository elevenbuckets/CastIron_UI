import React from 'react';
class DappViewService {
    constructor() {
        this.viewMap = {
            Scheduler: <SchedulerView />
        }
        this.viewMap.map((key) =>{
            let ppath = ""
            import key from ppath;
        } )
      
    }

    import(dapp){
       
    }

    getView = key =>{
        return this.viewMap[key];
    } 
}
const dappViewService = new DappViewService();

export default dappViewService;
