/**
 * Набор полей, описывающий положение в каталоге для произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.Classification',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.classification.class.Class'
		],
		xtype: 'form-desc-classification',
		items: [
			{
				xtype: 'form-desc-classification-class',
				layout: 'hbox',
				combineErrors: true,
				msgTarget: 'side',
				defaults: {
					width: 200,
					labelWidth: 200,
					labelAlign: 'right',
					msgTarget: 'none',
					margin: '0 2 0 0'
				}
			}
		]
	}
);