// Reflux Actions
import Reflux from 'reflux';
// let CastIronActions = Reflux.createActions(['enqueue', 'dequeue', 'send', 'batchSend']);
let CastIronActions = Reflux.createActions(['enqueue', 'dequeue', 'clearQueue', 'send', 'sendTxInQueue',
'selectAccount', 'batchSend','startUpdate', 'statusUpdate', 'finishUpdate', 'infoUpdate','selectedTokenUpdate',
'addQ', 'changeView', 'updateReceipts', 'sendTk','masterUpdate', 'confirmTx', 'cancelTx', 'sendTks', 
'addressUpdate', 'gasPriceOptionSelect', 'customGasPriceUpdate', "schedule", "confirmScheduleTx", "cancelScheduleTx"]);
export default CastIronActions
