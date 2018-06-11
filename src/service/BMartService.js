import CastIronService from './CastIronService'
import path from 'path';
class BMartService {
    constructor() {

        const __pkgdir = path.join('dapps', 'BMart');
        const __abidir = path.join(__pkgdir, 'ABI');
        const __condir = path.join(__pkgdir, 'conditions');

        const abiPath = ctrName => { return path.join(__abidir, ctrName + '.json'); }
        const condPath = (ctrName, condName) => { return path.join(__condir, ctrName, condName + '.json') };
        // dApp specific info
        const __APP__ = 'BMart';

        this.wallet = CastIronService.wallet;

        // CastIron ABI + conditions loader
        this.wallet.newApp(__APP__)('0.2', 'ETHMall', abiPath('ETHMall'), { 'Sanity': condPath('ETHMall', 'Sanity') });
        this.wallet.newApp(__APP__)('0.2', 'Registry', abiPath('Registry'), { 'Sanity': condPath('Registry', 'Sanity') });


        this.ETHMall = this.wallet.CUE[__APP__]['ETHMall'];
        this.Registry = this.wallet.CUE[__APP__]['Registry'];


       
    }

    


}

const bmartService = new BMartService();

export default BMartService;
