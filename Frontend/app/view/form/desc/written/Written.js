/**
 * Дата и место написания произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.written.Written',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.written.date.date.DateText',
			'FBEditor.view.form.desc.written.date.date.DateValue',
			'FBEditor.view.form.desc.written.date.publicated.DateText',
			'FBEditor.view.form.desc.written.date.publicated.DateValue',
			'FBEditor.view.form.desc.written.date.translated.DateText',
			'FBEditor.view.form.desc.written.date.translated.DateValue'
		],
		xtype: 'form-desc-written',
		id: 'form-desc-written',
		layout: 'hbox',
		prefixName: 'written',

		translateText: {
			lang: 'Язык',
			writtenLang: 'Язык оригинала',
			date: 'Дата ',
			dateText: 'Дата текстом',
			country: 'Страна',
			translated: 'Дата перевода',
			translatedText: 'Дата перевода текстом',
			datePublic: 'Дата публикации',
			datePublicText: 'Дата публикации текстом'
		},

		initComponent: function ()
		{
			var me = this,
				prefixName = me.prefixName;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					flex: 1,
					layout: 'anchor',
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
						labelWidth: 160,
						keyEnterAsTab: true
					},
					items: [
						{
							xtype: 'langfield',
							name: 'lang',
							fieldLabel: me.translateText.lang,
							allowBlank: false,
							forceSelection: true,
							value: 'ru',
							cls: 'field-required',
							listeners: {
								afterrender: function ()
								{
									var me = this,
										store = me.getStore();

									// убираем первые две записи из списка
									store.remove([0, 1]);
								}
							}
						},
						{
							xtype: 'langfield',
							name: prefixName + '-lang',
							fieldLabel: me.translateText.writtenLang,
							forceSelection: true,
							cls: 'field-optional'
						},
						{
							xtype: 'countryfield',
							name: prefixName + '-country',
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
						cls: 'field-optional',
						keyEnterAsTab: true
					},
					items: [
						{
							xtype: 'form-desc-written-date-value',
							name: prefixName + '-date-value',
							fieldLabel: me.translateText.date
						},
						{
							xtype: 'form-desc-written-date-text',
							name: prefixName + '-date-text',
							fieldLabel: me.translateText.dateText
						},
						{
							xtype: 'form-desc-written-date-translated-value',
							name: 'translated-value',
							fieldLabel: me.translateText.translated
						},
						{
							xtype: 'form-desc-written-date-translated-text',
							name: 'translated-text',
							fieldLabel: me.translateText.translatedText
						},
						{
							xtype: 'form-desc-written-date-publicated-value',
							name: prefixName + '-date-public-value',
							fieldLabel: me.translateText.datePublic
						},
						{
							xtype: 'form-desc-written-date-publicated-text',
							name: prefixName + '-date-public-text',
							fieldLabel: me.translateText.datePublicText
						}
					]
				}
			];
			me.callParent(arguments);
		},

		isValid: function ()
		{
			var me = this,
				isValid;

			isValid = me.getValid(me.prefixName);
			me.down('langfield').isValid();

			return isValid;
		},

		getValues: function (d)
		{
			var me = this,
				prefixName = me.prefixName,
				data = d,
				values,
				datePublic;

			data.lang = me.down(me.down('[name=lang]')).getValue();

			values = {
				_value: Ext.Date.format(me.down(me.down('[name=' + prefixName + '-date-value]')).getValue(), 'Y-m-d'),
				__text: me.down(me.down('[name=' + prefixName + '-date-text]')).getValue()
			};
			values = me.removeEmptyValues(values);

			datePublic = {
				_value: Ext.Date.format(me.down(me.down('[name=' + prefixName + '-date-public-value]')).getValue(), 'Y-m-d'),
				__text: me.down(me.down('[name=' + prefixName + '-date-public-text]')).getValue()
			};
			datePublic = me.removeEmptyValues(datePublic);

			values = {
				lang: me.down(me.down('[name=' + prefixName + '-lang]')).getValue(),
				country: me.down(me.down('[name=' + prefixName + '-country]')).getValue(),
				date: values,
				'date-public': datePublic
			};
			values = me.removeEmptyValues(values);

			if (values)
			{
				data[prefixName] = values;
			}

			values = {
				_value: Ext.Date.format(me.down(me.down('[name=translated-value]')).getValue(), 'Y-m-d'),
				__text: me.down(me.down('[name=translated-text]')).getValue()
			};
			values = me.removeEmptyValues(values);

			if (values)
			{
				data.translated = values;
			}

			return data;
		}
	}
);