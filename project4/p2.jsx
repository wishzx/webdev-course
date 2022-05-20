import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';

import States from './components/states/States';
import Header from './components/header/Header';

ReactDOM.render(
  <div><Header /><States /></div>,
  document.getElementById('reactapp'),
);
