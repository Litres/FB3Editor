/**
 * Информация о файле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.DocumentInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-documentInfo',

		translateText: {
			created: 'Файл создан',
			date: 'Дата',
			time: 'Время',
			updated: 'Последнее изменение',
			otherInfo: 'Прочая информация',
			programUsed: 'Программа',
			srcUrl: 'URL',
			ocr: 'OCR',
			editor: 'Редактор'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.created,
					require: true,
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
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
											xtype: 'datefield',
											allowBlank: false,
											name: 'document-info-created-date',
											value: new Date(),
											fieldLabel: me.translateText.date,
											cls: 'field-required'
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
										labelWidth: 110
									},
									items: [
										{
											xtype: 'timefield',
											allowBlank: false,
											name: 'document-info-created-time',
											value: new Date(),
											format: 'H:i:s',
											fieldLabel: me.translateText.time,
											cls: 'field-required'
										}
									]
								}
							]
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.updated,
					require: true,
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
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
											xtype: 'displayfield',
											//allowBlank: false,
											name: 'document-info-updated-date',
											//disabled: true,
											fieldLabel: me.translateText.date/*,
											cls: 'field-required'*/
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
										labelWidth: 110
									},
									items: [
										{
											xtype: 'displayfield',
											//allowBlank: false,
											name: 'document-info-updated-time',
											format: 'H:i:s',
											//disabled: true,
											fieldLabel: me.translateText.time/*,
											cls: 'field-required'*/
										}
									]
								}
							]
						}
					]
				},
				{
					xtype: 'desc-fieldsetinner',
					title: me.translateText.otherInfo,
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										xtype: 'textfield',
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 160,
										cls: 'field-optional'
									},
									items: [
										{
											xtype: 'displayfield',
											name: 'document-info-program-used',
											fieldLabel: me.translateText.programUsed,
											value: 'FB3Editor'
										},
										{
											name: 'document-info-editor',
											fieldLabel: me.translateText.editor
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
										xtype: 'textfield',
										anchor: '100%',
										labelAlign: 'right',
										labelWidth: 110,
										cls: 'field-optional'
									},
									items: [
										{
											xtype: 'textfieldclear',
											vtype: 'url',
											name: 'document-info-src-url',
											fieldLabel: me.translateText.srcUrl
										},
										{
											name: 'document-info-ocr',
											fieldLabel: me.translateText.ocr
										}
									]
								}
							]
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
				created,
				updated,
				time,
				values;

			created = Ext.Date.format(me.down('[name=document-info-created-date]').getValue(), 'Y-m-d');
			time = Ext.Date.format(me.down('[name=document-info-created-time]').getValue(), 'H:i:s');
			created = created && time ? created + 'T' + time : null;

			// дата и время модификации формируются автоматически
			updated = Ext.Date.format(new Date(), 'Y-m-d');
			time = Ext.Date.format(new Date(), 'H:i:s');
			updated = updated && time ? updated + 'T' + time : null;

			values = {
				_created: created,
				_updated: updated,
				'_program-used': me.down('[name=document-info-program-used]').getValue(),
				'_src-ur': me.down('[name=document-info-src-url]').getValue(),
				_ocr: me.down('[name=document-info-ocr]').getValue(),
				_editor: me.down('[name=document-info-editor]').getValue()
			};
			data['document-info'] = me.removeEmptyValues(values);

			return data;
		}
	}
);