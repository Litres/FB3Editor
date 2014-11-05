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
			'FBEditor.view.form.desc.classification.class.Class',
			'FBEditor.view.form.desc.classification.target.Target',
			'FBEditor.view.form.desc.classification.coverage.Coverage'
		],
		xtype: 'form-desc-classification',
		items: [
			{
				xtype: 'form-desc-classification-class',
				layout: 'hbox',
				combineErrors: true,
				msgTarget: 'side',
				defaults: {
					flex: 1,
					labelWidth: 200,
					labelAlign: 'right',
					msgTarget: 'none',
					margin: '0 2 0 0'
				}
			},
			{
				xtype: 'form-desc-subject',
				plugins: 'fieldreplicator'
			},
			{
				xtype: 'textfield',
				name: 'classification-customSubject',
				fieldLabel: 'Новый жанр',
				labelWidth: 200,
				labelAlign: 'right',
				allowBlank: true,
				plugins: 'fieldreplicator'
			},
			{
				xtype: 'form-desc-classification-target',
				layout: 'hbox',
				combineErrors: true,
				msgTarget: 'side',
				defaults: {
					flex: 1,
					labelWidth: 200,
					labelAlign: 'right',
					msgTarget: 'none',
					margin: '0 2 0 0'
				}
			},
			{
				xtype: 'form-desc-classification-coverage',
				layout: 'hbox',
				combineErrors: true,
				msgTarget: 'side',
				defaults: {
					flex: 1,
					labelWidth: 200,
					labelAlign: 'right',
					msgTarget: 'none',
					margin: '0 2 0 0'
				}
			}
		]
	}
);