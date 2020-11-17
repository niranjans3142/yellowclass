import React, { Component }       from 'react';
import './App.css';

import {useSelector,useDispatch} from 'react-redux';
import {increment} from './actions/UIAction'
import Masonry from './component/Masonry';
function App(props) {
  const counter = useSelector(state => state.counterReducerState)
  const dispatch = useDispatch();

  return (
    <div className="App">
      <header className="App-header">

      </header>
      <main>
        <section>
          <Masonry counterReducerState={counter}></Masonry>
        </section>
      </main>
    </div>
  );
}

export default App;
