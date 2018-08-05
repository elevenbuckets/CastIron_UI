import IPFS_Base from 'ipfs_base/IPFS_Base';
// orbit-db modules will be loaded here.

class IPFSService {
    constructor() {
        this.IPFSBase = new IPFS_Base('.local/config.json');
    }

    pullFile = (ipfshash, outpath) => {
        return this.IPFSBase.read(ipfshash).then((r) => {
                fs.writeFileSync(outpath, r);
                return true;
        })
}
    // Orbit-db related services will be integrated from here.
}

const IPFSServ = new IPFSService();
console.log(`IPFS service loaded...`);

export default IPFSServ;
