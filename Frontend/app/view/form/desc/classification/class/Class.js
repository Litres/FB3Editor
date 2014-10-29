/**
 * Литературная форма.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.class.Class',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.classification.class.Contents'
		],
		xtype: 'form-desc-classification-class',
		fieldLabel: 'Литературная форма',
		items: [
			{
				xtype: 'form-desc-bookClass',
				hideLabel: true
			},
			{
				xtype: 'form-desc-classification-class-contents',
				hideLabel: true
			}
		]
	}
);