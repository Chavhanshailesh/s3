import React from 'react';
import ReactDOM from 'react-dom';
import '../sass/index.scss';
import App from './app'
import { initTranslation } from 'common/translation';

//await initTranslation();

ReactDOM.render(<App/>, document.getElementById('app'));
