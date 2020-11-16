import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/* REDUX INTEGRATION STARTS */
import { createStore } from 'redux';
import stateRedux from './reducers/Reducer';
import {Provider} from 'react-redux'

let reduxStore = createStore(stateRedux)
//display in console
reduxStore.subscribe( () => {console.log(reduxStore.getState())})
/* REDUX INTEGRATION ENDS */

ReactDOM.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
