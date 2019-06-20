import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import {reduce} from './reducers';

import App from './App';
import Title from './Title';
import Footer from './Footer';

import './index.css';

// polyfill
if(!window.Object.values)
    window.Object.values=(o)=>Object.keys(o).map(k=>o[k]);

let store=applyMiddleware(thunk)(createStore)(
    reduce,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <Title />
        <div className="container">
            <App />
            <Footer />
        </div>
    </Provider>,
    document.getElementById('root')
);
