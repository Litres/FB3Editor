/**
 * Информация о серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.Sequence',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.sequence.Sequence'
		],
		xtype: 'desc-fieldset-sequence',
		title: 'Серия',
		xtypeChild: 'sequence',
		require: true
	}
);