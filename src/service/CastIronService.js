import Wallet from 'CastIron/core/Wallet'
class CastIronService {
    constructor() {
        // TODO: change this to be a relative path
        this.wallet = new Wallet('.local/config.json');
        this.getAccounts = this.getAccounts.bind(this);
        this.state= {
            currentQs :[]
        }
        this.addQ = this.addQ.bind(this);
        this.deleteQ = this.deleteQ.bind(this);
        this.clearQ = this.clearQ.bind(this);
    }

    getAccounts(){
        return this.wallet.allAccounts();
    }

    addQ(Q){
        this.state.currentQs.push(Q);
    }

    deleteQ(Q){
        this.state.currentQs.splice( this.state.currentQs(Q), 1);
    }

    clearQ(){
        this.state.currentQs = [];
    }
    

}

const castIronService = new CastIronService();

export default castIronService;
