import tar from 'tar';
import DappViewService from '../service/DappViewService';
class Installer {

    constructor(){
    }

  

    install =  (appName) =>{
        this.fetchPackage(appName);

        let file = "../dapps/" + appName + ".tar.gz";
        console.log("untar the " + file);
        tar.x({
            file : file,
            C: "../dapps"
        }).then(
            this.postInstall()
        )
    }

    // fetch package
    fetchPackage = (appName) =>{

    }



    postInstall = () => {
      
        let json = require("../../dapps/installed_back_up.json");
        let fs = require('fs');
        fs.writeFile("../dapps/installed.json", JSON.stringify(json), 'utf8', DappViewService.initialize);

    }
}

const installer = new Installer()

const runInstall = () =>{
    console.log()
    installer.install("Schedular")
}

runInstall();

export default installer;
