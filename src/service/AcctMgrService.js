import Accounts from 'accMgr/Accounts';
const remote = require('electron').remote;

class AcctMgrService {
    constructor() {
        this.cfgobj = remote.getGlobal('cfgobj');
        this.accMgr = new Accounts(this.cfgobj.configDir);
    }
}

const AcctMgrServ = new AcctMgrService();
console.log(AcctMgrServ.accMgr.config);

export default AcctMgrServ;
