// Reflux Actions
import Reflux from 'reflux';
// let CastIronActions = Reflux.createActions(['enqueue', 'dequeue', 'send', 'batchSend']);
let CastIronActions = Reflux.createActions(['enqueue', 'dequeue', 'send', 
'selectAccount', 'batchSend','startUpdate', 'statusUpdate', 'finishUpdate']);
export default CastIronActions