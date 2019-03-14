import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './index.css';
import Home from './Start';
import App from './App';
import List from './tokenList';
import Buyer from './buyerPage';
import Owner from './ownerPage';
import Room from './roomInfo';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <Router>
        <div>
          <Route exact path="/" component={Home}></Route>
          <Route path="/register" component={App}></Route>
          <Route path="/list" component={List}></Route>
          <Route path="/buyer" component={Buyer}></Route>
          <Route path="/owner" component={Owner}></Route>
          <Route path="/room/:id" component={Room}></Route>
        </div>
    </Router>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
