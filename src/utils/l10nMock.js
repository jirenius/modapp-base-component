/**
 * Mock of the modapp-l10n package..
 * If not included as a dependency, modapp-base-component will fallback
 * to just returning the string version of whatever is provided as argument.
 */
export default {
	t: s => String(s)
};
