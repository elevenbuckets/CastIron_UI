import React, { Component } from 'react';
import Reflux from 'reflux';
import Accounts from '../components/Accounts';
import SendTX from '../components/SendTX';
import CastIronStore from '../store/CastIronStore';


class ReceiptsView extends Reflux.Component {
    constructor(props) {
        super(props);

        this.store = CastIronStore;

        this.state = {
            queue: [12, 15],
            receitps: [
                {
                    TxHash: "0xd951b4b515f098594765832aca9f530295e49c2715dbf4eccd9d8f4eb6c372a2",
                    From: "0xddf3f378ba74a00dfc90803033bfb2f653888f27",
                    To: " 0xe896236391edf23c2f159219884372472ad0b106",
                    Value: "1 Ether",
                    Status: "Success"
                },
                {
                    TxHash: "0xeb992e6fc98661a5db03fb60d2eb8030bcde0850d75602e707be977a92093088 ",
                    From: "0x563b377a956c80d77a7c613a9343699ad6123911",
                    To: " 0xdfa8f389d133bcba798d07d8017d06fb265a3437",
                    Value: "0.21642664 Ether",
                    Status: "Pending"
                }
            ]
        }

    }

    _onSelect(value) {
        this.setState((preState) => {
            let state = preState;
            state.selected_account = JSON.parse(value.value);
            return state;
        })

    }

    render() {
        return (
            <div>
                <h1>This is the great Receipts view!</h1>
                {
                    this.state.receitps.map((tx) => (<p key={JSON.stringify(tx)}>{JSON.stringify(tx)}</p>))
                }
            </div>

        )
    }

}

export default ReceiptsView