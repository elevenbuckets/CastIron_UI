import tar from 'tar';
import DappViewService from '../service/DappViewService';
import IPFSService from '../service/IPFSService'
class Installer {

    constructor() {
    }



    install = (appName) => {
        let file = "./dapps/" + appName + ".tar.gz";
        console.log("untar the " + file);
        return tar.x({
            file: file,
            C: "./dapps"
        }).then(_ => {
            return this.postInstall(appName)
        }

        )
    }

    // fetch package from IPFS 
    fetchPackage = (appName) => {
        let outputPath = "./dapps/" + appName + ".tar.gz";
        return IPFSService.pullFile("QmRACrfrYvC7F54yQzYygaPrg5ohBrkYr6WXJEZVPuTeqi",outputPath);   
    }



    postInstall = (appName) => {
        const fs = require('fs');
        let json = require("../../dapps/installed.json");
        let manifestPath = "../../dapps/" + appName + "/manifest.json";
        let packageJson = require(manifestPath);
        let newPackage = {};
        newPackage[appName] = packageJson;
        json = { ...json, ...newPackage };
        console.log("Writing json to ./dapps/installed.json");
        console.log(json);
        console.log(process.cwd())
        const util = require('util');
        // const writeFile = util.promisify(fs.writeFile);
        // return writeFile("./dapps/installed.json", JSON.stringify(json), 'utf8').then(()=>{
        //     DappViewService.initialize();
        //     return true;
        // })

        fs.writeFileSync("./dapps/installed.json", JSON.stringify(json), 'utf8');
        return DappViewService.initialize();
    }
}

const installer = new Installer()

// const runInstall = () =>{

//     console.log()

//     installer.fetchPackage("Schedular")
//     installer.install("Schedular")
// }

// runInstall();

export default installer;
