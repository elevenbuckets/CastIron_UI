import Wallet from 'CastIron/core/CastIron';
import path from 'path';
class CastIronService {
    constructor() {

        const __pkgdir = path.join('dapps', 'BMart');
        const __abidir = path.join(__pkgdir, 'ABI');
        const __condir = path.join(__pkgdir, 'conditions');

        const abiPath = ctrName => { return path.join(__abidir, ctrName + '.json'); }
        const condPath = (ctrName, condName) => { return path.join(__condir, ctrName, condName + '.json') };
        // dApp specific info
        const __APP__ = 'BMart';

        this.wallet = new Wallet('.local/config.json');
        // CastIron ABI + conditions loader
        this.wallet.newApp(__APP__)('0.2', 'ETHMall', abiPath('ETHMall'), { 'Sanity': condPath('ETHMall', 'Sanity') });
        this.wallet.newApp(__APP__)('0.2', 'Registry', abiPath('Registry'), { 'Sanity': condPath('Registry', 'Sanity') });




        this.getAccounts = this.getAccounts.bind(this);
        this.state = {
            currentQs: []
        }
        this.addQ = this.addQ.bind(this);
        this.deleteQ = this.deleteQ.bind(this);
        this.clearQ = this.clearQ.bind(this);
    }

    getAccounts() {
        return this.wallet.allAccounts();
    }

    addQ(Q) {
        this.state.currentQs.push(Q);
    }

    deleteQ(Q) {
        this.state.currentQs.splice(this.state.currentQs(Q), 1);
    }

    clearQ() {
        this.state.currentQs = [];
    }


}

const castIronService = new CastIronService();

export default castIronService;
