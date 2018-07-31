import React from 'react';
class DappViewService {
    constructor() {
        this.viewMap = {
        }
        this.initialize();
    }

    initialize = () =>{
        let dapps = this.getInstalledDappsInfo();

        Object.keys(dapps).map((key) =>{
            let ppath = "../../dapps/" + key + "/public/view/" + dapps[key].view;
            import(ppath).then(
                View =>{
                    console.log("view is : ");
                    console.log(View);
                    this.viewMap[key] = <View.default />;  
                }
            );
             
        } )
    }

    getInstalledDappsInfo(){
        let path = "../../dapps/installed.json";
        return require(path);
        
    }

    getView = key =>{
        return this.viewMap[key];
    } 
}
const dappViewService = new DappViewService();

export default dappViewService;
