/**
 * Helper functions to handle objects implementing the modapp LocaleString interface.
 */

function hasMethod(v, m) {
	return v && typeof v === 'object' && typeof v[m] === 'function';
}

function hasOnOff(v) {
	return hasMethod(v, 'on') && hasMethod(v, 'off');
}

export function translate(v) {
	if (hasMethod(v, 'translate')) {
		return v.translate();
	}
	return String(v);
};

export function onLocaleUpdate(v, cb) {
	if (hasOnOff(v)) {
		v.on('localeUpdate', cb);
	}
}

export function offLocaleUpdate(v, cb) {
	if (hasOnOff(v)) {
		v.off('localeUpdate', cb);
	}
}
