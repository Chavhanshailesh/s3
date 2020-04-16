import makeStories, { knob } from '../../storybook/helper';

import Button from './Button';

makeStories(module, Button, {
	default: {
		label: knob.text('Submit'),
	},
	brand: {
		appearance: 'brand',
		label: 'Brand Button',
	},
	rounded: {
		appearance: 'rounded',
		label: 'Rounded Button',
	},
	disabled: {
		label: 'Disabled Button',
		disabled: knob.boolean(true),
	},
	danger: {
		appearance: 'danger',
		label: 'Danger Button',
	},
	dangerSmall: {
		appearance: 'danger',
		size: 'small',
		label: 'Danger small',
	},
	'has icon': {
		label: 'Copy Text',
		icon: 'clipboard',
	},
	large: {
		label: "I'm big ol' Button",
		size: 'large',
	},
	'large brand': {
		label: "I'm big and I'm brand",
		appearance: 'brand',
		size: 'large',
	},
	'large disabled': {
		label: 'Large inactive',
		size: 'large',
		disabled: knob.boolean(true),
	},
	'large has icon': {
		label: 'Dark text and icon',
		icon: 'attachment',
		size: 'large',
		color: 'inherit',
	},
});
