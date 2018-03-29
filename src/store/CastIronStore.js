import BittrexService from '../service/BittrexService';
import Reflux from 'reflux';

class CastIronStore extends Reflux.Store{
    constructor(){
        super();
        // this.bittrexService = BittrexService;
    }
}

// const castIronStore = new CastIronStore()

CastIronStore.id = "CastIronStore";

export default CastIronStore