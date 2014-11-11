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

		translateText: {
			udkError: 'Значение должно соответсвовать шаблону \d+(\.\d+)+(:\d+)?. Например: 373.167.1:58',
			bbkError: 'Значение должно соответсвовать шаблону \d+([\.а-я]\d+)+. Например: 28.5я72'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form-desc-classification-class',
					layout: 'hbox',
					combineErrors: true,
					msgTarget: 'side',
					defaults: {
						flex: 1,
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
						labelAlign: 'right',
						msgTarget: 'none',
						margin: '0 2 0 0'
					}
				},
				{
					xtype: 'textfield',
					name: 'classification-udk',
					fieldLabel: 'Код УДК',
					labelAlign: 'right',
					allowBlank: true,
					regex: /^\d+(\.\d+)+(:\d+)?$/,
					regexText: me.translateText.udkError,
					emptyText: me.translateText.udkError,
					plugins: 'fieldreplicator'
				},
				{
					xtype: 'textfield',
					name: 'classification-bbk',
					fieldLabel: 'Код ББК',
					labelAlign: 'right',
					allowBlank: true,
					regex: /^\d+([\.а-я]\d+)+$/,
					regexText: me.translateText.bbkError,
					emptyText: me.translateText.bbkError,
					plugins: 'fieldreplicator'
				}
			];
			me.callParent(arguments);
		}
	}
);