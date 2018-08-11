import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReceiptsView from './view/ReceiptsView';
import Dashboard from './view/Dashboard';
import NotFound from './view/NotFound';
import CastIronStore from './store/CastIronStore';

ReactDOM.render(<Dashboard />, document.getElementById('app'));