/**
 * Целевая аудитория.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.Target',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.classification.target.Education'
		],
		xtype: 'form-desc-classification-target',
		layout: 'hbox',

		translateText: {
			desc: 'Описание',
			minAge: 'Мин возраст',
			maxAge: 'Макс возраст'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					flex: 1,
					layout: 'anchor',
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
						labelWidth: 160,
						cls: 'field-optional'
					},
					items: [
						{
							xtype: 'textfield',
							name: 'classification-target-audience-text',
							fieldLabel: me.translateText.desc
						},
						{
							xtype: 'form-desc-classification-target-education',
							name: 'classification-target-audience-education'
						}
					]
				},
				{
					xtype: 'fieldcontainer',
					width: 50
				},
				{
					xtype: 'desc-fieldcontainer',
					flex: 1,
					layout: 'anchor',
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
						labelWidth: 110,
						cls: 'field-optional'
					},
					items: [
						{
							xtype: 'numberfield',
							name: 'classification-target-audience-age-min',
							fieldLabel: me.translateText.minAge,
							minValue: 2,
							maxValue: 50
						},
						{
							xtype: 'numberfield',
							name: 'classification-target-audience-age-max',
							fieldLabel: me.translateText.maxAge,
							minValue: 2,
							maxValue: 150
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);