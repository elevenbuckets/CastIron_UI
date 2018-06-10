import Accounts from 'accMgr/Accounts';

class AcctMgrService {
    constructor() {
        this.accMgr = new Accounts('.local');
    }
}

const AcctMgrServ = new AcctMgrService();
console.log(AcctMgrServ.accMgr.config);

export default AcctMgrServ;
