import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import WalletView from './view/WalletView';
import ReceiptsView from './view/ReceiptsView';
import QueryForm from './view/App';
import Dashboard from './view/Dashboard';
import NotFound from './view/NotFound';
import CastIronStore from './store/CastIronStore';

const routes = (
    <BrowserRouter>
        <div>
            <Dashboard/>
            <Switch>
                <Route path="/receipts" component={ReceiptsView} />
                <Route path="/queryForm" component={QueryForm} />
                <Route path="/" component={WalletView}  />
                <Route component={NotFound} />

            </Switch>
        </div>
    </BrowserRouter>
)



ReactDOM.render(routes, document.getElementById('app'));

