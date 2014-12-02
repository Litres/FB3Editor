/**
 * Классификация произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.Classification',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.classification.Classification'
		],
		xtype: 'desc-fieldset-classification',
		title: 'Классификация произведения',
		xtypeChild: 'classification',
		require: true
	}
);