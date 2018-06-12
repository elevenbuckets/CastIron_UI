import CastIronService from './CastIronService'
import path from 'path';

 // dApp specific info
const __APP__ = 'BMart';
const __pkgdir = path.join('dapps', __APP__);
const __abidir = path.join(__pkgdir, 'ABI');
const __condir = path.join(__pkgdir, 'conditions');

const abiPath = ctrName => { return path.join(__abidir, ctrName + '.json'); }
const condPath = (ctrName, condName) => { return path.join(__condir, ctrName, condName + '.json') };
class BMartService {
    constructor() {

        this.wallet = CastIronService.wallet;

        // CastIron ABI + conditions loader
        this.wallet.newApp(__APP__)('0.2', 'ETHMall', abiPath('ETHMall'), { 'Sanity': condPath('ETHMall', 'Sanity') });
        this.wallet.newApp(__APP__)('0.2', 'Registry', abiPath('Registry'), { 'Sanity': condPath('Registry', 'Sanity') });

        this.ETHMall = this.wallet.CUE[__APP__]['ETHMall'];
        this.Registry = this.wallet.CUE[__APP__]['Registry'];

    }

    getAppName = () => {
        return __APP__
    }

    generateNewPoSIMSApp = (addr, shopAddr) => {
        this.wallet.newApp(__APP__)('0.2', 'PoSIMS' + addr, abiPath('PoSIMS'), { 'Sanity': condPath('PoSIMS', 'Sanity') }, shopAddr);
    }

    getPoSIMS = (addr) => {
        return this.wallet.CUE[__APP__]['PoSIMS' + addr];
    }
}
const bmartService = new BMartService();

export default bmartService;
