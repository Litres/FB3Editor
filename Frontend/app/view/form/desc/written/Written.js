/**
 * Дата и место написания произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.written.Written',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-written',
		id: 'form-desc-written',
		layout: 'hbox',

		translateText: {
			lang: 'Язык',
			writtenLang: 'Язык оригинала',
			date: 'Дата',
			dateText: 'Дата текстом',
			country: 'Страна'
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
						labelWidth: 160
					},
					items: [
						{
							xtype: 'langfield',
							name: 'lang',
							fieldLabel: me.translateText.lang,
							allowBlank: false,
							forceSelection: true
						},
						{
							xtype: 'langfield',
							name: 'written-lang',
							fieldLabel: me.translateText.writtenLang,
							allowBlank: false,
							forceSelection: true
						},
						{
							xtype: 'countryfield',
							name: 'written-country',
							fieldLabel: me.translateText.country,
							cls: 'field-optional'
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
							name: 'written-date-value',
							fieldLabel: me.translateText.date
						},
						{
							xtype: 'textfield',
							name: 'written-date-text',
							fieldLabel: me.translateText.dateText
						}
					]
				}
			];
			me.callParent(arguments);
		},

		getValues: function (d)
		{
			var me = this,
				data = d,
				values;

			values = {
				_value: Ext.Date.format(me.down(me.down('[name=written-date-value]')).getValue(), 'Y-m-d'),
				__text: me.down(me.down('[name=written-date-text]')).getValue()
			};
			values = me.removeEmptyValues(values);
			values = {
				lang: me.down(me.down('[name=written-lang]')).getValue(),
				country: me.down(me.down('[name=written-country]')).getValue(),
				date: values
			};
			values = me.removeEmptyValues(values);
			if (values)
			{
				data.written = values;
			}
			data.lang = me.down(me.down('[name=lang]')).getValue();

			return data;
		}
	}
);