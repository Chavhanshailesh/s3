import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ICON_DATA from '../constants/IconDataConstants';

const getShape = (data, key) => {
	if (typeof data === 'string') {
		return <path d={ data } key={ key } />;
	}

	if (data.type === 'rect') {
		return (
			<rect
				x={ data.x }
				y={ data.y }
				width={ data.width }
				height={ data.height }
				rx={ data.rx }
				key={ key }
			/>
		);
	}

	if (data.type === 'circle') {
		return <circle cx={ data.x } cy={ data.y } r={ data.r } key={ key } />;
	}

	return null;
};

const Icon = React.memo((props) => {
	const {
		name,
		title,
		isLegacy,
		sourceSize,
		isNaturalWidth,
	} = props;

	const icon = ICON_DATA[name];

	if (!icon) {
		return null;
	}

	let dataKey = 'data';

	if (!isLegacy) {
		dataKey = sourceSize.toString();

		if (typeof icon[dataKey] === 'undefined') {
			const defaultKey = Object.keys(icon)[0];

			dataKey = defaultKey;

			if (process.env.NODE_ENV !== 'production') {
				// eslint-disable-next-line no-console
				console.warn('Icon `%s` is not available in source size `%s`, used `%s` instead', name, sourceSize, defaultKey);
			}
		}
	}

	const classes = classnames({
		Icon: true,
		[`Icon--${name}`]: true,
		'Icon--notLine': isLegacy,
		'Icon--line': !isLegacy,
	});


	return (
		<i className={ classes } title={ title } style={ { width: isNaturalWidth ? `${sourceSize}px` : undefined } }>
			<svg viewBox={ !isLegacy ? `0 0 ${dataKey} ${dataKey}` : icon.viewBox }>
				{ typeof icon[dataKey] === 'string' ? <path d={ icon[dataKey] } /> : icon[dataKey].map(getShape) }
			</svg>
		</i>
	);
});

Icon.displayName = 'Icon';

Icon.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string,
	isLegacy: PropTypes.bool,
	sourceSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	isNaturalWidth: PropTypes.bool,
};

Icon.defaultProps = {
	sourceSize: 28,
	isLegacy: false,
	isNaturalWidth: false,
};

export default Icon;
