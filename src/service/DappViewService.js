import React from 'react';
class DappViewService {
    constructor() {
        this.viewMap = {
        }

        let dapps = {"Schedular": "SchedulerView"}

        Object.keys(dapps).map((key) =>{
            let ppath = "../../dapps/" + key + "/public/view/" + dapps[key];
            import(ppath).then(
                view =>{
                    this.viewMap[key] = <view />;  
                }
            );
             
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
