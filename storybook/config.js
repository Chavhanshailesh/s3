import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Import CSS required for the components
import '../sass/index.scss';
import '../sass/font.scss';
import './storybook.css';

// import logo from '../img/simpplr.svg';
console.log("object")

addParameters({
	options: {
		theme: create({
			brandTitle: 'Simpplr',
			brandUrl: 'https://simpplr.com'
		}),
		sortStoriesByKind: true,
		panelPosition: 'bottom',
	},
});

// Add page padding
addDecorator(story => (
	<div style={ { padding: '64px', minHeight: '100vh' } }>
		{ story() }
	</div>
));

// Add mock store
const mockStore = configureStore();
const store = mockStore();

addDecorator(story => (
	<Provider store={ store }>{ story() }</Provider>
));

addDecorator(
	withInfo({
		header: false,
		inline: false,
	})
);
addDecorator(withKnobs);

global.Simpplr = {
	Settings: {
		APP_NAME: 'Simpplr',
	},
};

global.IN_SANDBOX = true;

console.log("object")

// Find our stories
const req = require.context('../js/components', true, /\.stories\.(js|jsx)$/);
function loadStories() {
	console.log("object")
	req.keys().forEach(filename => req(filename));
}

// Start storybook up
configure(loadStories, module);

// import { configure } from '@storybook/react';

// configure(require.context('../src/components', true, /\.stories\.js$/), module);

