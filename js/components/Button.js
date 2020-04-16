import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from './Icon';
import { Link } from 'react-router-dom';

class Button extends React.PureComponent {
	render() {
		const {
			label,
			icon,
			linkTo,
			onClick,
			href,
			disabled,
			type,
			size,
			children,
			openInSameWindow,
			hasMinWidth,
			isInInput,
			isFieldHeight,
			color,
			appearance,
			buttonRef,
			floatRight,
		} = this.props;

		const classes = classnames({
			Button: true,
			[`Button--${size}`]: size,
			[`Button--${appearance}`]: appearance,
			'Button--hasIcon': icon,
			'Button--inInput': isInInput,
			'Button--isFieldHeight': isFieldHeight,
			'u-textInheritColor': color === 'inherit',
			'Button--minWidth': hasMinWidth,
			'theme--border theme--after--bg Button--brandHover': appearance === 'brandHover',
			'theme--color': appearance === 'brandHover' && size === 'micro',
			'u-floatRight': floatRight,
		});

		const inner = [
			<span className="Button-text" key="text">
				{ children || label }
			</span>,
		];

		if (size !== 'micro' && icon) {
			inner.unshift(
				<span className={ `Button-iconContainer Button-iconContainer--${icon}` } key="icon">
					<Icon name={ icon } sourceSize={ size === 'large' ? 20 : 12 } />
				</span>
			);
		}

		if (linkTo) {
			return (
				<Link to={ linkTo } className={ classes } onClick={ onClick }>
					{ inner }
				</Link>
			);
		}

		if (href) {
			return (
				<a
					href={ href }
					className={ classes }
					data-open-in-same-window={ openInSameWindow || null }
					onClick={ onClick }
				>
					{ inner }
				</a>
			);
		}

		return (
			// eslint-disable-next-line react/button-has-type
			<button
				ref={ buttonRef }
				type={ type }
				className={ classes }
				disabled={ disabled === true }
				onClick={ onClick }
			>
				{ inner }
			</button>
		);
	}
}

Button.propTypes = {
	label: PropTypes.string,
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	size: PropTypes.oneOf(['micro', 'small', 'large', 'xlarge', false]),
	appearance: PropTypes.oneOf([
		'normal', 'brand', 'rounded', 'danger', 'success', 'brandHover',
		'transparent', 'fill', 'dangerHover', 'warningHover',
	]),
	type: PropTypes.string,
	color: PropTypes.oneOf(['inherit']),
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	href: PropTypes.string,
	linkTo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	openInSameWindow: PropTypes.bool,
	children: PropTypes.node,
	isInInput: PropTypes.bool,
	isFieldHeight: PropTypes.bool,
	hasMinWidth: PropTypes.bool,
	floatRight: PropTypes.bool,
	buttonRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

Button.defaultProps = {
	icon: false,
	type: 'button',
	disabled: false,
	openInSameWindow: false,
	onClick: null,
	hasMinWidth: false,
	floatRight: false,
	isFieldHeight: false,
};

export default Button;
