import Wallet from 'CastIron/core/Wallet'
class CastIronService {
    constructor() {
        // TODO: change this to be a relative path
        this.wallet = new Wallet('/home/liang/Liang_Learn/git_hub/castIron_ui/CastIron_UI/src/.local/config.json');
        this.getAccounts = this.getAccounts.bind(this);
    }

    getAccounts(){
        return this.wallet.allAccounts();
    }

}

const castIronService = new CastIronService();

export default castIronService;