export const validateWidgetExport = (fn: object): true | string => {
	/**
	 *	A widget's main export should be a (factory) function.
	 *	When called, the factory function should return an object that
	 *	implements the IWidgetFormat interface.
	 */

	if (typeof fn !== 'function')
		return "Widget doesn't return a factory function for it's main class.";

	const obj = fn({});
	if (!obj)
		return "Widget's factory function doesn't return an object.";

	return true;
}