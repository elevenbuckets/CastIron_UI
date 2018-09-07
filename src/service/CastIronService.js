'use strict';

import Wallet from 'CastIron/core/CastIron';
import path from 'path';

/** NOT using them for now, should be re-enabled as generic purpose bootstrap function for individual dapp
const __pkgdir = path.join('dapps', 'BMart');
const __abidir = path.join(__pkgdir, 'ABI');
const __condir = path.join(__pkgdir, 'conditions');
const abiPath = ctrName => { return path.join(__abidir, ctrName + '.json'); }
const condPath = (ctrName, condName) => { return path.join(__condir, ctrName, condName + '.json') };
*/

class CastIronService {
    constructor() {
        this.wallet = new Wallet('.local/config.json');
        this.state = { currentQs: [] }
    }

    getAccounts = () => { return this.wallet.allAccounts(); }
    addQ = (Q) => { this.state.currentQs.push(Q); }
    deleteQ = (Q) => { this.state.currentQs.splice(this.state.currentQs(Q), 1); }
    clearQ = () => { this.state.currentQs = []; }
}

const castIronService = new CastIronService();
export default castIronService;
