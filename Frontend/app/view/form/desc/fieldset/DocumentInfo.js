/**
 * Информация о файле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.DocumentInfo',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.documentInfo.DocumentInfo'
		],
		xtype: 'desc-fieldset-documentInfo',
		title: 'Информация о файле',
		xtypeChild: 'documentInfo',
		require: true,
		autoExpand: false
	}
);