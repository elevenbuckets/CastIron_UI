import Wallet from 'CastIron/core/Wallet'
class CastIronService {
    constructor() {
        this.wallet = new Wallet(1100);
        this.wallet.ipcPath = '/home/liang/.ethereum/net41100/geth.ipc';
        // setup
        this.wallet.condition = 'sanity';
        this.wallet.gasPrice = 20000000000; // 20 GWei
        this.wallet.passVault = __dirname + '/.local/passes.json'; 
        this.getAccount = this.getAccount.bind(this);
    }

    getAccount(){
        return this.wallet.allAccounts();
    }

}

const castIronService = new CastIronService();

export default castIronService;