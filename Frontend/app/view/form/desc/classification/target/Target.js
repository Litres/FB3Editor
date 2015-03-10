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
			'FBEditor.view.form.desc.classification.target.Education',
			'FBEditor.view.form.desc.classification.target.ageMin.AgeMin'
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
							xtype: 'form-desc-classification-target-agemin',
							name: 'classification-target-audience-age-min',
							fieldLabel: me.translateText.minAge
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
						labelWidth: 120,
						cls: 'field-optional'
					},
					items: [
						{
							xtype: 'numberfield',
							name: 'classification-target-audience-age-max',
							fieldLabel: me.translateText.maxAge,
							minValue: 2,
							maxValue: 150
						},
						{
							xtype: 'textfield',
							name: 'classification-target-audience-text',
							fieldLabel: me.translateText.desc
						}
					]
				}
			];
			me.callParent(arguments);
		},

		getValues: function ()
		{
			var me = this,
				data,
				values = {
					__text: me.down('[name=classification-target-audience-text]').getValue(),
					_education: me.down('[name=classification-target-audience-education]').getValue(),
					'_age-min': me.down('[name=classification-target-audience-age-min]').getValue(),
					'_age-max': me.down('[name=classification-target-audience-age-max]').getValue()
				};

			data = me.removeEmptyValues(values);

			return data;
		}
	}
);