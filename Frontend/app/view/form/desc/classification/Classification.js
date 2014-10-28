/**
 * Набор полей, описывающий положение в каталоге для произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.Classification',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-classification',
		items: [
			{
				xtype: 'textfield',
				name: 'classification-class',
				fieldLabel: 'Литературная форма',
				allowBlank: false
			}
		]
	}
);