/**
 * Пользовательская информация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.CustomInfo',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.customInfo.CustomInfo'
		],
		xtype: 'desc-fieldset-customInfo',
		title: 'Пользовательская информация',
		xtypeChild: 'customInfo',
		autoExpand: false
	}
);