import './index.html';
import './style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/index';

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('App')
  );
}

render(App);

if (module.hot) {
  module.hot.accept('./components/index', () => {
    render(App);
  });
}
