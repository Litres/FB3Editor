/**
 * Привязка к месту и времени.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.coverage.Coverage',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-classification-coverage',
		layout: 'hbox',

		translateText: {
			desc: 'Описание',
			country: 'Страна',
			place: 'Место',
			date: 'Дата',
			dateFrom: 'Дата начала',
			dateTo: 'Дата окончания',
			age: 'Век'
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
							name: 'classification-coverage-age',
							fieldLabel: me.translateText.age
						},
						{
							xtype: 'countryfield',
							name: 'classification-coverage-country',
							fieldLabel: me.translateText.country
						},
						{
							xtype: 'textfield',
							name: 'classification-coverage-place',
							fieldLabel: me.translateText.place
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
							xtype: 'datefield',
							name: 'classification-coverage-date',
							fieldLabel: me.translateText.date
						},
						{
							xtype: 'datefield',
							name: 'classification-coverage-date-from',
							fieldLabel: me.translateText.dateFrom
						},
						{
							xtype: 'datefield',
							name: 'classification-coverage-date-to',
							fieldLabel: me.translateText.dateTo
						},
						{
							xtype: 'textfield',
							name: 'classification-coverage-text',
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
					__text: me.down('[name=classification-coverage-text]').getValue(),
					_country: me.down('[name=classification-coverage-country]').getValue(),
					_place: me.down('[name=classification-coverage-place]').getValue(),
					_age: me.down('[name=classification-coverage-age]').getValue(),
					_date: Ext.Date.format(me.down('[name=classification-coverage-date]').getValue(), 'Y-m-d'),
					'_date-from': Ext.Date.format(me.down('[name=classification-coverage-date-from]').getValue(),
					                              'Y-m-d'),
					'_date-to': Ext.Date.format(me.down('[name=classification-coverage-date-to]').getValue(), 'Y-m-d')
				};

			data = me.removeEmptyValues(values);

			return data;
		}
	}
);