// Reflux Actions
import Reflux from 'reflux';
// let CastIronActions = Reflux.createActions(['enqueue', 'dequeue', 'send', 'batchSend']);
let CastIronActions = Reflux.createActions(['enqueue', 'dequeue', 'clearQueue', 'send', 
'selectAccount', 'batchSend','startUpdate', 'statusUpdate', 'finishUpdate', 'infoUpdate','selectedTokenUpdate']);
export default CastIronActions