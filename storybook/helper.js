import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import {
	text,
	boolean,
	number,
	color,
	array,
	object,
	select,
	date,
} from '@storybook/addon-knobs';

function makeKnobProxy(origFunc) {
	return (...args) => ({
		__knobProxy: true,
		args,
		origFunc,
	});
}

function knobSniffer(Component, propName) {
	const type = (Component.propTypes || {})[propName];
	const defaultValue = (Component.defaultProps || {})[propName];

	if (type instanceof PropTypes.string) {
		return text(propName, defaultValue || '');
	}
	if (type instanceof PropTypes.number) {
		return number(propName, defaultValue || 0);
	}
	if (type instanceof PropTypes.bool) {
		return boolean(propName, defaultValue || false);
	}

	return false;
}

export const knob = {
	text: makeKnobProxy(text),
	string: makeKnobProxy(text),
	boolean: makeKnobProxy(boolean),
	bool: makeKnobProxy(boolean),
	number: makeKnobProxy(number),
	color: makeKnobProxy(color),
	object: makeKnobProxy(object),
	array: makeKnobProxy(array),
	select: makeKnobProxy(select),
	date: makeKnobProxy(date),
};

function nameFromPath(path) {
	const match = path.match(/\/components\/(.*?)\.stories.jsx?/);

	return match && match[1];
}

export default function makeStory(module, Component, stories, decoratorStyles) {
	const instance = storiesOf(nameFromPath(module.id), module);

	const Decorator = storyFn => (
		<div style={ decoratorStyles }>{ storyFn() }</div>
	);

	instance.addDecorator(Decorator);
	instance.addDecorator(StoryRouter());

	Object.keys(stories).forEach((name) => {
		let wrapper = stories[name];

		if (typeof wrapper !== 'function') {
			wrapper = () => {
				const props = Object.assign({}, stories[name]);
				// TODO we should detect can/is props and add boolean knobs for them by default
				// Reconcile our knobs into their real functions
				Object.keys(props).forEach((propName) => {
					if (props[propName]) {
						if (props[propName].__knobProxy) {
							props[propName] = props[propName].origFunc(propName, ...props[propName].args);
						} else {
							// Fall back to detecting knobs based on default props
							const detectKnob = knobSniffer(Component, propName);
							if (detectKnob !== false) {
								props[propName] = detectKnob;
							}
						}
					}
				});

				return React.createElement(Component, props);
			};
		}

		instance.add(name, wrapper);
	});

	return instance;
}
