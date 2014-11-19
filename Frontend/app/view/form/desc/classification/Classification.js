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
			customSubject: 'Новый жанр',
			udk: 'Код УДК',
			bbk: 'Код ББК',
			udkError: 'Значение должно соответсвовать шаблону \d+(\.\d+)+(:\d+)?. Например: 373.167.1:58',
			bbkError: 'Значение должно соответсвовать шаблону \d+([\.а-я]\d+)+. Например: 28.5я72'
		},

		initComponent: function ()
		{
			var me = this,
				labelStyleAllow = me.fieldDefaults.labelStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

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
					name: 'classification-subject'
				},
				{
					name: 'classification-custom-subject',
					fieldLabel: me.translateText.customSubject,
					labelStyle: labelStyleAllow,
					plugins: 'fieldreplicator'
				},
				{
					xtype: 'form-desc-classification-target',
					layout: 'hbox',
					combineErrors: true,
					msgTarget: 'side',
					labelStyle: labelStyleAllow,
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
					labelStyle: labelStyleAllow,
					defaults: {
						flex: 1,
						labelAlign: 'right',
						msgTarget: 'none',
						margin: '0 2 0 0'
					}
				},
				{
					name: 'classification-udk',
					fieldLabel: me.translateText.udk,
					labelStyle: labelStyleAllow,
					regex: /^\d+(\.\d+)+(:\d+)?$/,
					regexText: me.translateText.udkError,
					emptyText: me.translateText.udkError,
					plugins: 'fieldreplicator'
				},
				{
					name: 'classification-bbk',
					fieldLabel: me.translateText.bbk,
					labelStyle: labelStyleAllow,
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