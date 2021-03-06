'use strict';

// Major third-party modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import Modal from 'react-modal';
import path from 'path';
import os from 'os';
const ipcRenderer = require('electron').ipcRenderer;

// Singleton services
import CastIronService from '../service/CastIronService';
import DappViewService from '../service/DappViewService';
import ConfigWriterService from '../service/ConfigWriterService';

// Reflux store
import CastIronStore from '../store/CastIronStore';

// Reflux actions
import CastIronActions from '../action/CastIronActions';

// Views
import States from './States';
import Accounts from './Accounts';
import Login from './Login';
import MainView from './MainView';
import Sidebar from './Sidebar';

// Modals
import ConfirmTXModal from '../components/ConfirmTXModal';
import AlertModal from '../components/AlertModal';
import ScheduleTXModal from '../components/ScheduleTXModal';

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.state = {
            drawerOut: false,
            defaultCfgDir: path.join(os.homedir(), '.castiron'),    // init setup-only value
            defaultDataDir: path.join(os.homedir(), '.ethereum'),   // init setup-only value
            defaultRepoDir: path.join(os.homedir(), 'ipfs_repo'),   // init setup-only value
	    defaultNetID: 4,     				    // init setup-only value
	    previousView: ""
        }

        this.storeKeys = [
		"unlocked", 
		"currentView", 
		"modalIsOpen", 
		"scheduleModalIsOpen", 
		"retrying", 
		"rpcfailed", 
		"configured", 
		"userCfgDone", 
		"syncInProgress",
	        "blockHeight",
		"highestBlock"	
	];
    }

    confirmTX = () => { CastIronActions.confirmTx(); }
    cancelTX = () => { CastIronActions.cancelTx(); }
    confirmScheduleTX = (queue) => { CastIronActions.confirmScheduleTx(queue); }
    cancelScheduleTX = () => { CastIronActions.cancelScheduleTx(); }
    reinit = () => { CastIronActions.initPlatform(); };
    relaunch = () => { ipcRenderer.send('reload', true); };
    setupdone = () => {
	// confine config fields
        const mainFields = ["configDir"];
        const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI",
         "condition", "networkID","tokens", "watchTokens", "passVault"];
        const ipfsFields = ["lockerpathjs", "repoPathJs", "lockerpathgo", "repoPathGo", "ipfsBinary"];

	// ConfigWriter instances
        let mainWriter = ConfigWriterService.getFileWriter("public/.local/bootstrap_config.json", mainFields);
        let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.state.defaultCfgDir + "/config.json"), castIronFields);
        let ipfsWriter = ConfigWriterService.getFileWriter(path.join(this.state.defaultCfgDir, "/ipfsserv.json"), ipfsFields);

	// internal config update
        let mainJson = { "configDir": this.state.defaultCfgDir };
        mainWriter.writeJSON(mainJson);

	// castiron config update
        let castIronJson = {
            "datadir": this.state.defaultDataDir,
            "rpcAddr": "http://127.0.0.1:8545",
            "ipcPath": path.join(this.state.defaultDataDir, "geth.ipc"),
            "defaultGasPrice": "20000000000",
            "gasOracleAPI": "https://ethgasstation.info/json/ethgasAPI.json",
            "condition": "sanity",
            "networkID": this.state.defaultNetID,
            "passVault": path.join(this.state.defaultCfgDir, "myArchive.bcup"),
            "tokens":{},
            "watchTokens": []
        }

        castIronWriter.writeJSON(castIronJson);

	// ipfs config update
        let ipfsJson = {
            "lockerpathjs": path.join(this.state.defaultCfgDir, ".ipfslock"),
            "lockerpathgo": path.join(this.state.defaultCfgDir, ".ipfslock_go"),
            "repoPathGo": this.state.defaultRepoDir
        }

        ipfsWriter.writeJSON(ipfsJson);

        this.setState({ userCfgDone: true })
    };

    updateState = (key, e) => {
        this.setState({ [key]: e.target.value });
    }

    passAccRef = () => {
	return ReactDOM.findDOMNode(this.refs.Accounts).firstChild;
    }

    updatePv = (view) => {
	    this.setState({previousView: view});
    }

    render() {
        console.log("in Dashboard render()")

	if (   
             this.state.configured === true 
          && this.state.retrying == 0 
          && this.state.rpcfailed === false 
          && this.state.syncInProgress === true ) 
        {
	    if (   
                   this.state.highestBlock === 0 
                || this.state.highestBlock === this.state.blockHeight ) 
            {
	            document.body.style.background = "rgb(17, 31, 47)";
		    return (
	                <div className="container locked" style={{ background: "rgb(17, 31, 47)"}}>
	                    <div className="item list" style={{ background: "none" }}>
	                        <div style={{ border: "2px solid white", padding: "40px", textAlign: "center" }}>
				    <div className="loader syncpage"></div><br/>
	                            <p style={{ alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" }}>
	                                Awaiting incomming blocks from peers ...
				    </p>
	                        </div>
	                    </div>
	                </div>
		    );
	    } else {
	            document.body.style.background = "linear-gradient(-180deg, rgb(17, 31, 47), rgb(24, 156, 195))";
		    return (
	                <div className="container locked" style={{ background: "none"}}>
	                    <div className="item list" style={{ background: "none" }}>
	                        <div style={{ border: "2px solid white", padding: "40px", textAlign: "center" }}>
				    <div className="loader"></div><br/>
	                            <p style={{ alignSelf: "flex-end", fontSize: "24px", marginTop: "10px" }}>
	                                Block syncing in progress {this.state.blockHeight} / {this.state.highestBlock} ...
				    </p>
	                        </div>
	                    </div>
	                </div>
		    );
	    }
	} else if (this.state.configured === false) {
            document.body.style.background = "linear-gradient(-120deg, rgb(17, 31, 47), rgb(24, 156, 195))";
            return (
                <div className="container locked" style={{ background: "none"}}>
                    <div className="item list" style={{ background: "none" }}>
                        <div style={{ border: "2px solid white", padding: "40px", textAlign: "center", background: "none" }}>
                            <p style={{ alignSelf: "flex-end", fontSize: "24px" }}>
                                Welcome, dApp developers!
				</p><br />
                            <p style={{ alignSelf: "flex-end", fontSize: "24px" }}>
                                Thank you for trying out ElevenBuckets Build Environment (11BE)!
				</p><br />
                            <p style={{ alignSelf: "flex-end", fontSize: "24px" }}>
                                Please setup the following paths to continue:
				</p><br />
                            <Login updateState={this.updateState} 
			           defaultCfgDir={this.state.defaultCfgDir}
			           defaultDataDir={this.state.defaultDataDir}
			           defaultNetID={this.state.defaultNetID}
				   defaultRepoDir={this.state.defaultRepoDir}
				 />
                            {
                                this.state.userCfgDone ? <input style={{ marginTop: "25px" }}
                                    type="button" className="button reload" value="restart" onClick={this.relaunch} />
                                    : <input style={{ marginTop: "25px" }}
                                        type="button" className="button reload" value="confirm" onClick={this.setupdone} />
                            }
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.retrying > 0 && this.state.rpcfailed === false) {
            document.body.style.background = "linear-gradient(100deg, rgb(17, 31, 47), rgb(24, 156, 195))";
            return (
                <div className="container locked" style={{ background: "none"}}>
                    <div className="item list" style={{ background: "none" }}>
                        <div style={{ border: "2px solid white", padding: "44px", textAlign: "center" }}>
                            <p style={{ fontSize: "22px" }}>Connecting to local geth RPC ({this.state.retrying + ' / 3'})</p>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.retrying == 3 && this.state.rpcfailed === true) {
            document.body.style.background = "linear-gradient(100deg, rgb(17, 31, 47), rgb(24, 156, 195))";
            return (
                <div className="container locked" style={{ background: "none"}}>
                    <div className="item list" style={{ background: "none" }}>
                        <div style={{ border: "2px solid white", padding: "40px", textAlign: "center" }}>
                            <p style={{ alignSelf: "flex-end", fontSize: "22px" }}>
                                Please check your geth RPC connection
				</p>
                            <input style={{ marginTop: "25px" }}
                                type="button" className="button reload" value="retry" onClick={this.reinit} />
                        </div>
                    </div>
                </div>
            );
        } else if (   
		this.state.syncInProgress === false 
             && this.state.configured === true 
             && this.state.retrying == 0 
             && this.state.rpcfailed === false 
             && this.state.unlocked === false ) 
	{
            document.body.style.background = "url(./assets/blockwall.png)";
            return (
                <div className="container locked">
                    <States />
                    <Login />
                </div>
            );
        } else if ( 
                this.state.syncInProgress === false 
             && this.state.configured === true 
             && this.state.retrying == 0 
             && this.state.rpcfailed === false 
             && this.state.unlocked === true ) 
        {
            document.body.style.background = "linear-gradient(200deg, rgb(17, 31, 47), rgb(24, 156, 195))";
            return (
                <div className="container unlocked">
                    <States />
                    <Accounts ref="Accounts"/>
                    <MainView canvas={this.passAccRef} updatePv={this.updatePv} />
                    <Sidebar previousView={this.state.previousView} updatePv={this.updatePv} />
                    <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen && this.state.unlocked} style=
                        {{
                            overlay: { width: '100%', maxHeight: '100%', zIndex: '5', backgroundColor: "rgba(0,12,20,0.75)" },
                            content: {
                                top: '40%', left: '31%', right: '31%', bottom: '40%',
                                border: "2px solid yellow",
                                backgroundColor: "black",
                                borderRadius: "6px",
                                color: "yellow",
                                textAlign: "center",
                                fontSize: "26px",
                                display: "grid",
                                padding: "0px",
                                gridTemplateRows: "1fr 1fr",
                                gridTemplateColumns: "1fr",
                                alignItems: "center"
                            },
                        }}> Please confirm!
                      <ConfirmTXModal confirmTX={this.confirmTX} cancelTX={this.cancelTX} />
                    </Modal>
                    <ScheduleTXModal confirmScheduleTX={this.confirmScheduleTX} cancelScheduleTX={this.cancelScheduleTX}
                        isScheduleModalOpen={this.state.scheduleModalIsOpen} />
                </div>
            )
        }
    }
}

export default DashBoard;

