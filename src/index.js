import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';

import App from './App';
import Title from './Title';
import {reduce} from './reducers';

import './index.css';

let store=applyMiddleware(thunk)(createStore)(
    reduce,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <Title />
        <div className="container">
            <App />
        </div>
    </Provider>,
    document.getElementById('root')
);
