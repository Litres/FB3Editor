/**
 * История.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.History',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.history.History'
		],
		xtype: 'desc-fieldset-history',
		title: 'История',
		xtypeChild: 'history'
	}
);