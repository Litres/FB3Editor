/**
 * Привязка к месту и времени.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.setting.Setting',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-classification-setting',
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
						cls: 'field-optional',
						keyEnterAsTab: true
					},
					items: [
						{
							xtype: 'textfield',
							name: 'classification-setting-age',
							fieldLabel: me.translateText.age
						},
						{
							xtype: 'countryfield',
							name: 'classification-setting-country',
							fieldLabel: me.translateText.country
						},
						{
							xtype: 'textfield',
							name: 'classification-setting-place',
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
						cls: 'field-optional',
						keyEnterAsTab: true
					},
					items: [
						{
							xtype: 'desc-date',
							name: 'classification-setting-date',
							fieldLabel: me.translateText.date
						},
						{
							xtype: 'desc-date',
							name: 'classification-setting-date-from',
							fieldLabel: me.translateText.dateFrom
						},
						{
							xtype: 'desc-date',
							name: 'classification-setting-date-to',
							fieldLabel: me.translateText.dateTo
						},
						{
							xtype: 'textfield',
							name: 'classification-setting-text',
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
					__text: me.down('[name=classification-setting-text]').getValue(),
					_country: me.down('[name=classification-setting-country]').getValue(),
					_place: me.down('[name=classification-setting-place]').getValue(),
					_age: me.down('[name=classification-setting-age]').getValue(),
					_date: Ext.Date.format(me.down('[name=classification-setting-date]').getValue(), 'Y-m-d'),
					'_date-from': Ext.Date.format(me.down('[name=classification-setting-date-from]').getValue(),
					                              'Y-m-d'),
					'_date-to': Ext.Date.format(me.down('[name=classification-setting-date-to]').getValue(), 'Y-m-d')
				};

			data = me.removeEmptyValues(values);

			return data;
		}
	}
);