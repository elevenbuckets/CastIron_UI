import React from 'react';
class DappViewService {
    constructor() {
        this.viewMap = {
        }
        this.initialize();
    }

    initialize = () =>{
        let dapps = this.getInstalledDappsInfo();

        console.log("dapps in DappViewService is： " + dapps);
        console.log(dapps);

        Object.keys(dapps).map((key) =>{
            let ppath = "../../dapps/" + key + "/public/view/" + dapps[key].mainView;
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
        let path = "./dapps/installed.json";
        let fs = require('fs');
        return JSON.parse(fs.readFileSync(path, 'utf8'));
        
    }

    getView = key =>{
        return this.viewMap[key];
    } 
}
const dappViewService = new DappViewService();

export default dappViewService;
