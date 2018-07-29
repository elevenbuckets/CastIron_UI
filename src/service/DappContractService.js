import CastIronService from './CastIronService'
import path from 'path';

// This class requires package manifest to contain 4 information:
// 1. appName; 2. version; 3. list of contract names (no suffix); 4. active app network id.
// Note: currently Dapp Contract Service assume (hard coded) condition checks to be 'Sanity'
class DappContractService {
    constructor() {
        this.wallet  = CastIronService.wallet;
	this.activeNetID = manifest.activeNetID || '1100';
	this.APPs = {};
	this.manifests = {};
    }

    pkgDir = (appName) => { return path.join('dapps', appName); }
    abiDir = (appName) => { return path.join(this.pkgDir(appName), 'ABI'); }
    conDir = (appName) => { return path.join(this.pkgDir(appName), 'conditions'); }

    abiPath  = (appName, ctrName) => { return path.join(this.abiDir(appName), ctrName + '.json'); }
    condPath = (appName, ctrName, condName) => { return path.join(this.conDir(appName), ctrName, condName + '.json'); };

    init = (manifest) => {
	let __APP__ = manifest.appName; 
	let version = manifest.version;
        let ctrList = manifest.ctrList;

	this.manifests[__APP__] = manifest;

	manifest.ctrList.map((ctrName) => {
		if (this.wallet.networkID === this.activeNetID) {
           		this.wallet.newApp(__APP__)(version, ctrName, this.abiPath(__APP__, ctrName), { 'Sanity': this.condPath(ctrName, 'Sanity') });
		} else {
			let nullAddr = this.wallet.web3.toAddress('0x0');
           	        this.wallet.newApp(__APP__)(version, ctrName, this.abiPath(__APP__, ctrName), { 'Sanity': this.condPath(ctrName, 'Sanity') }, nullAddr);
		}

        this.APPs[__APP__][ctrName] = this.wallet.CUE[__APP__][ctrName];
	})
    }

    generateNewOwnedApp = (appName, ctrName, addr, ctrAddr) => {
	let __APP__ = appName;
	let version = this.manifests[__APP__].version;

        this.wallet.newApp(__APP__)(version, ctrName + addr, this.abiPath(__APP__, ctrName), { 'Sanity': this.condPath(ctrName, 'Sanity') }, ctrAddr);
    }

    getOwnedApp = (appName, ctrName, addr) => {
        return this.wallet.CUE[appName][ctrName + addr];
    }
}

const DappContractService = new DappContractService();

export default DappContractService;
